import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Play, Square, AlertTriangle, ShieldCheck,
  CheckCircle, Activity, Brain, Server, Loader2, RefreshCw, BarChart2, Map as MapIcon, LayoutPanelLeft
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, Cell } from 'recharts';
import { db } from '../firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AlertOctagon, PhoneCall, Siren } from 'lucide-react';

/* ── TensorFlow.js globally loaded via CDN to bypass Vite module crash ── */
/* ── AI State ─ */
let poseDetector = null;
let faceDetector = null;
let objectDetector = null;
let tfLoaded = false;

/* ── Thresholds ── */
const IDLE_MS = 4000;
const FATIGUE_MS = 3000;
const NO_EQUIP_MS = 3000;

/* ── AI Config & Rules ── */
const BEHAVIOR_META = {
  working: { label: 'Working Safe ✅', color: '#14b8a6', bg: 'rgba(20,184,166,.15)' },
  idle: { label: 'Absent / Idle ⚠️', color: '#f59e0b', bg: 'rgba(245,158,11,.15)' },
  phone: { label: 'Phone Usage ❌', color: '#ef4444', bg: 'rgba(239,68,68,.15)' },
  fatigue: { label: 'Fatigue / Sleep 😴', color: '#a855f7', bg: 'rgba(168,85,247,.15)' },
  unsafe: { label: 'No Safety Gear 🛑', color: '#ef4444', bg: 'rgba(239,68,68,.15)' },
};

/* ── Color Logic for Safety Gear Hack ── */
// Check if a color is typical hard-hat or safety-vest color (Neon Yellow, Orange, Bright White)
function isSafetyColor(r, g, b) {
  const isYellow = (r > 180 && g > 180 && b < 100);
  const isOrange = (r > 200 && g > 100 && g < 180 && b < 100);
  const isWhite = (r > 200 && g > 200 && b > 200); // Sometimes white hard hats
  const isNeonGreen = (r < 150 && g > 200 && b < 100);
  return isYellow || isOrange || isWhite || isNeonGreen;
}

let trackedWorkersList = [];
let nextWorkerId = 1;

function processWorkersFrame(ctx, W, H, poses, objects, faces) {
  const phones = objects.filter(o => o.class === 'cell phone' || o.class === 'laptop');

  // 1. Extract Pose boxes (MIRRORED COORDINATES)
  const curPoses = poses.map(pose => {
    const kps = pose.keypoints.filter(k => k.score > 0.1).map(k => ({ ...k, x: W - k.x })); // FLIP X
    if (kps.length === 0) return null;
    const xs = kps.map(k => k.x);
    const ys = kps.map(k => k.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    return { type: 'pose', pose: { ...pose, keypoints: kps }, box: { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w: maxX - minX, h: maxY - minY } };
  }).filter(Boolean);

  // 2. Extract Face boxes (MIRRORED COORDINATES)
  const curFaces = faces.map(f => {
    const { xMin, yMin, width, height } = f.box;
    const mirX = W - (xMin + width); // FLIP X
    const box = { minX: mirX, minY: yMin, maxX: mirX + width, maxY: yMin + height, cx: mirX + width / 2, cy: mirX + height / 2, w: width, h: height };
    return { type: 'face', face: f, box };
  });

  // Combine detections
  const detections = [...curPoses];
  curFaces.forEach(fd => {
    const exists = detections.some(d => Math.hypot(d.box.cx - fd.box.cx, d.box.cy - fd.box.cy) < 100);
    if (!exists) detections.push({ ...fd, pose: null });
  });

  const nextTracked = [];
  
  // Safety Engagement Area (Center 80% ROI)
  const roi = { x: W * 0.1, y: H * 0.1, w: W * 0.8, h: H * 0.8 };

  detections.forEach(det => {
    const cw = det.box;
    // ROI FILTER
    if (cw.cx < roi.x || cw.cx > roi.x + roi.w || cw.cy < roi.y || cw.cy > roi.y + roi.h) return;

    let bestMatch = null, bestDist = Infinity;

    trackedWorkersList.forEach(ew => {
      const dist = Math.hypot(ew.cx - cw.cx, ew.cy - cw.cy);
      if (dist < 120 && dist < bestDist) { bestDist = dist; bestMatch = ew; }
    });

    let worker;
    if (bestMatch) {
      worker = { ...bestMatch, ...cw, pose: det.pose };
      trackedWorkersList = trackedWorkersList.filter(w => w.id !== bestMatch.id);
    } else {
      worker = { id: `EMP-0${nextWorkerId++}`, ...cw, pose: det.pose, risk: 0, lastVoiceTime: 0 };
    }

    worker.phone = false; worker.fatigue = false; worker.helmet = true;
    worker.hasFace = !!det.face || (det.pose && det.pose.keypoints.some(k => k.name === 'nose' && k.score > 0.4));

    // Phone detection
    phones.forEach(p => {
      const pxC = p.bbox[0] + p.bbox[2] / 2, pyC = p.bbox[1] + p.bbox[3] / 2;
      if (pxC > worker.minX && pxC < worker.maxX && pyC > worker.minY && pyC < worker.maxY) worker.phone = true;
    });

    // Fatigue via Pose
    if (det.pose) {
      const p = det.pose;
      const nose = p.keypoints.find(k => k.name === 'nose'), lSh = p.keypoints.find(k => k.name === 'left_shoulder'), rSh = p.keypoints.find(k => k.name === 'right_shoulder');
      if (nose?.score > 0.3 && lSh?.score > 0.3 && rSh?.score > 0.3) {
        if (((lSh.y + rSh.y) / 2) - nose.y < 110) worker.fatigue = true;
      }
    }

    // PPE Hardening (Proxy Detections)
    worker.helmet = false;
    worker.vest = false;
    worker.goggles = false;
    worker.mask = false;
    worker.gloves = false;

    try {
      if (W > 0 && H > 0) {
        // Helmet/Vest Heuristics
        const hX = worker.cx, hY = worker.minY + 20;
        if (hX > 10 && hY > 10 && hX < W - 10 && hY < H - 10) {
          const px = ctx.getImageData(hX - 5, hY - 5, 10, 10).data;
          for (let i = 0; i < px.length; i += 4) if (isSafetyColor(px[i], px[i + 1], px[i + 2])) { worker.helmet = true; break; }
        }
        const vX = worker.cx, vY = worker.cy + (worker.h * 0.2);
        if (vX > 10 && vY > 10 && vX < W - 10 && vY < H - 10) {
          const px = ctx.getImageData(vX - 10, vY - 10, 20, 20).data;
          for (let i = 0; i < px.length; i += 4) if (isSafetyColor(px[i], px[i + 1], px[i + 2])) { worker.vest = true; break; }
        }

        // COCO PPE Proxies
        objects.forEach(obj => {
           const [oX, oY, oW, oH] = obj.bbox;
           const opX = oX + oW/2, opY = oY + oH/2;
           if (opX > worker.minX && opX < worker.maxX && opY > worker.minY && opY < worker.maxY) {
              if (obj.class === 'sports ball') worker.goggles = true;
              if (obj.class === 'cup')         worker.mask = true;
              if (obj.class === 'bottle')      worker.gloves = true;
           }
        });
      }
    } catch (e) { }

    const hazardItems = [];
    if (!worker.helmet) hazardItems.push('Helmet');
    if (!worker.vest) hazardItems.push('Vest');
    if (!worker.goggles) hazardItems.push('Goggles');
    if (!worker.mask) hazardItems.push('Mask');
    if (!worker.gloves) hazardItems.push('Gloves');
    if (worker.phone) hazardItems.push('Phone');
    if (worker.fatigue) hazardItems.push('Fatigue');
    if (isFalling) hazardItems.push('Fall');
    if (sosGesture) hazardItems.push('SOS');

    let totalRisk = (hazardItems.length * 15);
    if (isFalling || sosGesture) totalRisk = 100;

    worker.risk = Math.min(100, (worker.risk || 0) * 0.6 + totalRisk * 0.4);
    worker.status = sosGesture ? 'EMERGENCY' : isFalling ? 'FALLEN' : worker.risk > 70 ? 'CRITICAL' : worker.risk > 30 ? 'WARNING' : 'SAFE';
    worker.violations = hazardItems;
    worker.color = sosGesture || isFalling ? '#ef4444' : worker.risk > 70 ? '#ef4444' : worker.risk > 30 ? '#f59e0b' : '#14b8a6';
    worker.isFalling = isFalling;
    worker.sosGesture = sosGesture;

    nextTracked.push(worker);
  });

  trackedWorkersList = nextTracked;
  return trackedWorkersList;
}

const Monitoring = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const [sysState, setSysState] = useState('off');
  const [activeWorkers, setActiveWorkers] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('camera'); // camera | intelligence | map

  const [fps, setFps] = useState(0);
  const [errorObj, setError] = useState('');
  const lastSeenRef = useRef(Date.now());

  // Real-time Storage Sync to Authority Dashboard
  useEffect(() => {
    if (activeWorkers.length >= 0) {
      localStorage.setItem('raksha_live_snapshot', JSON.stringify({
        workers: activeWorkers,
        ts: Date.now()
      }));
    }
  }, [activeWorkers]);

  // Cloud Sync to Firebase (Throttle to every 4s to avoid quota)
  useEffect(() => {
    if (sysState === 'ready' && activeWorkers.length > 0) {
      const iv = setInterval(async () => {
        try {
          await setDoc(doc(db, 'telemetry', 'live_feed'), {
            workers: activeWorkers.map(w => ({ id: w.id, risk: w.risk, status: w.status, color: w.color })),
            ts: Date.now()
          });
        } catch (e) { console.error("Sync Failed", e); }
      }, 4000);
      return () => clearInterval(iv);
    }
  }, [activeWorkers, sysState]);

  // ── Logger ──
  const log = useCallback((msg, type = 'info') => {
    setAiLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 30));
  }, []);

  // ── Load TF models ──
  const bootAI = useCallback(async () => {
    if (tfLoaded) {
      setSysState('ready');
      return true;
    }
    try {
      setSysState('loading_ai');
      log('Booting Rakshatantra AI Engine...', 'system');

      const loadScript = (src) => new Promise((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) return res();
        const script = document.createElement('script');
        script.crossOrigin = 'anonymous';
        script.src = src;
        script.onload = res;
        script.onerror = rej;
        document.head.appendChild(script);
      });

      // Load all TF dependencies dynamically via CDN to bypass Vite bundling issues
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_detection');
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/face-detection');
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd');

      const tf = window.tf;
      const poseLib = window.poseDetection;
      const faceLib = window.faceDetection;
      const cocoLib = window.cocoSsd;

      await tf.ready();
      log(`TF.js Backend: ${tf.getBackend().toUpperCase()}`, 'system');

      log('Loading MoveNet Pose Model...', 'system');
      log('Loading MoveNet Pose Model...', 'system');
      poseDetector = await poseLib.createDetector(poseLib.SupportedModels.MoveNet, {
        modelType: poseLib.movenet.modelType.MULTIPOSE_LIGHTNING
      });

      log('Loading MediaPipe Face Model...', 'system');
      faceDetector = await faceLib.createDetector(faceLib.SupportedModels.MediaPipeFaceDetector, {
        runtime: 'tfjs', maxFaces: 5
      });

      log('Loading COCO-SSD Object Model...', 'system');
      objectDetector = await cocoLib.load();

      log('All AI Models Loaded Successfully', 'success');
      tfLoaded = true;
      setSysState('ready');
      return true;
    } catch (e) {
      console.error(e);
      log(`AI Engine Boot Failure: ${e.message}`, 'error');
      setError(`Failed to load AI: ${e.message}`);
      setSysState('error');
      return false;
    }
  }, [log]);

  // ── Start System ──
  const triggerSystem = useCallback(async () => {
    setError('');
    setSysState('loading_cam');
    log('Requesting Camera Access...', 'system');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      await new Promise((res, rej) => {
        video.onloadedmetadata = res;
        video.onerror = rej;
      });
      await video.play();
      log('Camera active. Resolving stream...', 'success');

      const video = videoRef.current;
      if (video) {
        console.log("Hardware Stream Initialized:", video.videoWidth, "x", video.videoHeight);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      await bootAI();
    } catch (e) {
      console.error(e);
      log(`Camera Error: ${e.message}`, 'error');
      setError('Camera access denied or device not found.');
      setSysState('error');
    }
  }, [bootAI, log]);

  const haltSystem = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const video = videoRef.current;
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    setSysState('off');
    setActiveWorkers([]);
    log('System Offline.', 'system');
  }, [log]);

  // ── AI Tracking Timers ──
  const timers = useRef({ idleStart: 0, fatigueStart: 0, phoneStart: 0, noEquipStart: 0 });

  // ── Detection Loop ──
  useEffect(() => {
    if (sysState !== 'ready') return;
    let frames = 0, lastFps = Date.now();

    const loop = async () => {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2 || sysState !== 'ready') return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        let poses = [], objects = [], faces = [];
        try {
          [poses, objects, faces] = await Promise.all([
            poseDetector.estimatePoses(video),
            objectDetector.detect(video),
            faceDetector.estimateFaces(video)
          ]);
        } catch (e) {
          console.warn("Detection Error", e);
        }

        const workers = processWorkersFrame(ctx, canvas.width, canvas.height, poses, objects, faces);
        setActiveWorkers([...workers]);

        drawHUD(ctx, canvas.width, canvas.height, workers, objects);

        const now = Date.now();
        workers.forEach(w => {
          if (w.risk > 70 && (now - w.lastVoiceTime > 15000)) {
            w.lastVoiceTime = now;
            let reason = w.phone ? 'phone' : w.fatigue ? 'fatigue' : 'unsafe';

            if (w.sosGesture || w.isFalling) {
              addDoc(collection(db, 'emergencies'), {
                workerId: w.id,
                type: w.sosGesture ? 'SOS_GESTURE' : 'MAN_DOWN',
                timestamp: serverTimestamp()
              }).catch(e => console.error(e));
              log(`!!! EMERGENCY !!! ${w.id} requires immediate assistance`, 'violation');
            }

            const violationData = { state: reason, workerId: w.id, risk: w.risk, t: now };
            window.localStorage.setItem('raksha_violation', JSON.stringify(violationData));
            addDoc(collection(db, 'violations'), { ...violationData, timestamp: serverTimestamp() }).catch(e => { });

            if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
              const speechMap = { phone: `${w.id}, phone usage prohibited.`, fatigue: `${w.id}, wake up.`, unsafe: `${w.id}, wear helmet.` };
              const ut = new SpeechSynthesisUtterance(speechMap[reason] || "Safety violation.");
              ut.lang = 'en-US';
              window.speechSynthesis.speak(ut);
            }
          }
        });

        frames++;
        if (now - lastFps > 1000) { setFps(frames); frames = 0; lastFps = now; }
      } catch (fatal) {
        console.error("Critical Loop Error", fatal);
      } finally {
        if (sysState === 'ready') rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sysState, log]);

  return (
    <div className="page-wrap grid-pattern">

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow"><Brain size={14} /> Rakshatantra Supreme AI</div>
          <h1 className="page-title">Real-Time Behavior & Safety Monitor</h1>
          <p style={{ color: 'var(--t-md)', marginTop: 6, fontSize: '.88rem' }}>Multi-model neural engine: Pose, Face, Objects, and Safety Compliance</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {sysState === 'off' || sysState === 'error' ? (
            <button onClick={triggerSystem} className="btn btn-primary btn-lg" style={{ gap: 8 }}>
              <Play size={15} /> Deploy AI Engine
            </button>
          ) : sysState === 'loading_cam' || sysState === 'loading_ai' ? (
            <button disabled className="btn btn-ghost" style={{ gap: 8 }}>
              <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Initializing...
            </button>
          ) : (
            <button onClick={haltSystem} className="btn btn-danger" style={{ gap: 8 }}>
              <Square size={14} /> Terminate
            </button>
          )}
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        {[
          { id: 'camera', label: 'Monitor Feed', icon: Camera },
          { id: 'intelligence', label: 'Risk Intelligence', icon: BarChart2 },
          { id: 'map', label: 'Security Map', icon: MapIcon },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '8px 16px', gap: 8, fontSize: '.75rem' }}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── CENTRAL NEURAL FLOW (FOCUS MODE) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
        
        {/* MAIN FEED */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <AnimatePresence mode="wait">
            {activeTab === 'camera' && (
              <motion.div key="cam" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', background: '#08080c', borderColor: 'rgba(59,130,246,0.3)' }}>
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' /* 4:3 */ }}>
                    <video ref={videoRef} playsInline muted style={{ display: 'none' }} />
                    <canvas ref={canvasRef} style={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover', display: sysState === 'ready' ? 'block' : 'none',
                    }} />

                    {sysState !== 'ready' && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--bg-1)' }}>
                        <div style={{ padding: 24, borderRadius: '50%', background: 'var(--blue-g)', border: '1px solid var(--border-hi)' }}>
                          {sysState.includes('loading') ? <Loader2 size={40} className="spin" color="var(--blue-br)" /> : <Camera size={40} color={sysState === 'error' ? 'var(--red-br)' : 'var(--blue-br)'} />}
                        </div>
                        <h3 style={{ color: 'var(--blue-br)', fontFamily: 'var(--font-h)' }}>
                          {sysState === 'loading_cam' ? 'Connecting to Hardware...' : sysState === 'loading_ai' ? 'Compiling Neural Networks...' : 'System Standby'}
                        </h3>
                        {errorObj && <p style={{ color: 'var(--red-br)', fontSize: '.8rem' }}>{errorObj}</p>}
                      </div>
                    )}

                    {sysState === 'ready' && (
                      <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', gap: 10 }}>
                        <button onClick={triggerManualSOS} className="btn btn-danger" style={{ borderRadius: 99, padding: '12px 24px', gap: 10, fontSize: '.8rem' }}>
                          <Siren size={18} /> MANUAL SOS
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'intelligence' && (
              <motion.div key="intel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="card" style={{ padding: 24 }}>
                  <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: 20 }}>Live Behavior Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activeWorkers.map(w => ({ name: w.id, risk: w.risk }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: 'var(--t-lo)', fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: 'var(--t-lo)', fontSize: 11 }} />
                      <ReTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0a0a0f', border: '1px solid var(--border)' }} />
                      <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                        {activeWorkers.map((entry, index) => (
                          <Cell key={index} fill={entry.risk > 70 ? 'var(--red-br)' : entry.risk > 30 ? 'var(--amber-br)' : 'var(--teal-br)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: 24, padding: 20, background: 'var(--bg-3)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--t-md)', fontSize: '.8rem', fontStyle: 'italic' }}>
                      "AI Advisory: System analytics indicate higher risk on EMP-01 due to phone usage. Probability for workplace injury increased by 14%."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'map' && (
              <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="card" style={{ padding: 24, background: '#050508', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'var(--font-h)' }}>Factory Hot-Zone Map (Zone A)</h3>
                    <div style={{ fontSize: '.7rem', color: 'var(--t-lo)' }}>Updating every 500ms</div>
                  </div>

                  {/* Grid Layout of Factory */}
                  <div style={{
                    height: 400, border: '1px dashed var(--border)', borderRadius: 8,
                    position: 'relative', background: 'radial-gradient(var(--blue) 1px, transparent 1px)',
                    backgroundSize: '30px 30px', opacity: 0.8
                  }}>
                    {/* Zones Overlay */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', borderRight: '1px solid var(--border)', background: 'rgba(59,130,246,0.03)', padding: 10, fontSize: '.6rem', color: 'var(--t-lo)' }}>Melting Furnace Area</div>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '50%', borderBottom: '1px solid var(--border)', background: 'rgba(20,184,166,0.02)', padding: 10, fontSize: '.6rem', color: 'var(--t-lo)' }}>Assembly Line B</div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '60%', height: '50%', background: 'rgba(245,158,11,0.02)', padding: 10, fontSize: '.6rem', color: 'var(--t-lo)' }}>Storage & Logistics</div>

                    {/* LIVE WORKER DOTS */}
                    {activeWorkers.map(w => {
                      // Map canvas X/Y to factory Map X/Y
                      const mapX = (w.cx / 640) * 100;
                      const mapY = (w.cy / 480) * 100;
                      return (
                        <motion.div
                          key={w.id}
                          initial={{ scale: 0 }} animate={{ scale: 1, left: `${mapX}%`, top: `${mapY}%` }}
                          style={{
                            position: 'absolute', width: 24, height: 24, transform: 'translate(-50%, -50%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          <div style={{
                            position: 'absolute', width: '100%', height: '100%',
                            background: w.color, opacity: 0.3, borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                          }} />
                          <div style={{ width: 10, height: 10, background: w.color, borderRadius: '50%', border: '2px solid white', zIndex: 1 }} />
                          <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '.6rem', color: 'white', fontWeight: 800, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
                            {w.id}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  <style>{`
                     @keyframes pulse {
                       0% { transform: scale(0.95); opacity: 0.5; }
                       70% { transform: scale(2.5); opacity: 0; }
                       100% { transform: scale(0.95); opacity: 0; }
                     }
                  `}</style>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Diagnostics (Simplified) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div className="card" style={{ padding: '16px', background: 'var(--bg-3)', textAlign: 'center' }}>
              <div style={{ fontSize: '.6rem', color: 'var(--t-lo)', textTransform: 'uppercase' }}>Identified</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--teal-br)' }}>{activeWorkers.length}</div>
            </div>
            <div className="card" style={{ padding: '16px', background: 'var(--bg-3)', textAlign: 'center' }}>
              <div style={{ fontSize: '.6rem', color: 'var(--t-lo)', textTransform: 'uppercase' }}>Avg. Risk</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-br)' }}>{activeWorkers.length ? (activeWorkers.reduce((acc, w) => acc + w.risk, 0) / activeWorkers.length).toFixed(0) : 0}%</div>
            </div>
            <div className="card" style={{ padding: '16px', background: 'var(--bg-3)', textAlign: 'center' }}>
              <div style={{ fontSize: '.6rem', color: 'var(--t-lo)', textTransform: 'uppercase' }}>Critical</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--red-br)' }}>{activeWorkers.filter(w => w.risk > 70).length}</div>
            </div>
            <div className="card" style={{ padding: '16px', background: 'var(--bg-3)', textAlign: 'center' }}>
              <div style={{ fontSize: '.6rem', color: 'var(--t-lo)', textTransform: 'uppercase' }}>Neural State</div>
              <div style={{ fontSize: '.8rem', fontWeight: 800, color: 'var(--blue-br)', paddingTop: 10 }}>{sysState.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
};

/* ── HUD Renderer (Draws Individual Worker Overlays) ── */
function drawHUD(ctx, W, H, workers, objects) {
  // 1. ROI Target Boundary
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(W * 0.1, H * 0.1, W * 0.8, H * 0.8);
  ctx.setLineDash([]);
  ctx.font = '800 10px monospace';
  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
  ctx.fillText("ACTIVE NEURAL ENGAGEMENT ZONE", W * 0.1 + 10, H * 0.1 + 15);

  // Objects (Phones/Laptops)
  objects.forEach(obj => {
    if (obj.class === 'cell phone' || obj.class === 'laptop') {
      const [x, y, w, h] = obj.bbox;
      const mirX = W - (x + w); // Flip for overlay if not already flipped
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(mirX, y, w, h);
    }
  });

  // Render Worker Bounding Boxes & HUD Panels
  workers.forEach(w => {
    // 2. Bounding Box & HUD (WITH GLOW)
    ctx.shadowBlur = 15;
    ctx.shadowColor = w.color;
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(
       Math.max(0, w.minX - 10),
       Math.max(0, w.minY - 20),
       Math.min(W, w.w + 20),
       Math.min(H, w.h + 40)
    );
    ctx.shadowBlur = 0; // reset

    // Debug Dot
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(w.cx, w.cy, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Floating Panel - HIGH FIDELITY
    const pX = w.maxX + 15;
    const pY = w.minY - 10;
    const pW = 150, pH = 145;
    
    ctx.fillStyle = 'rgba(10, 10, 20, 0.85)';
    ctx.fillRect(pX, pY, pW, pH);
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pX, pY, pW, pH);

    ctx.fillStyle = w.color;
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`${w.id}`, w.minX, w.minY - 30);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.fillText(`STATUS:`, pX + 12, pY + 22);

    const drawPpe = (label, ok, icon, y) => {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '10px sans-serif';
      ctx.fillText(`${icon} ${label}`, pX + 12, y);
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = ok ? '#14b8a6' : '#ef4444';
      ctx.fillText(ok ? 'OK' : 'MISSING', pX + 90, y);
    };

    drawPpe('Helmet:', w.helmet, '⛑️', pY + 40);
    drawPpe('Vest:',   w.vest,   '🦺', pY + 54);
    drawPpe('Goggles:',w.goggles, '👓', pY + 68);
    drawPpe('Mask:',   w.mask,   '😷', pY + 82);
    drawPpe('Gloves:', w.gloves, '🧤', pY + 96);
    drawPpe('No Phone:', !w.phone, '📱', pY + 110);
    drawPpe('Alert:', !w.fatigue, '😴', pY + 124);

    ctx.fillStyle = w.color;
    ctx.font = '900 12px monospace';
    ctx.fillText(`RISK: ${w.risk.toFixed(0)}%`, pX + 12, pY + 140);

    if (w.status === 'CRITICAL' || w.status === 'EMERGENCY') {
      const a = (Math.sin(Date.now() / 100) + 1) / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${a})`;
      ctx.font = '900 20px sans-serif';
      ctx.fillText(`🚨 ${w.status} DETECTED`, w.minX, w.minY - 40);
    }
  });
}

export default Monitoring;
