import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

/* ================= LOGIN ================= */
function Login({ onLogin }) {
  const [user,setUser]=useState("");
  const [pass,setPass]=useState("");

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>✨ Welcome</h1>
        <p>AI Image Studio</p>

        <input placeholder="Username" onChange={(e)=>setUser(e.target.value)}/>
        <input type="password" placeholder="Password" onChange={(e)=>setPass(e.target.value)}/>
        <button onClick={()=>user && pass && onLogin(true)}>Login</button>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ================= */
function Sidebar({ children }) {
  return (
    <div className="app-layout">
      <div className="sidebar">
        <h2>🌿 AI Studio</h2>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/models">Models</Link>
          <Link to="/studio">Studio</Link>
          <Link to="/history">History</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </div>
      <div className="main-content">{children}</div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard() {
  return (
    <div className="dashboard-full">
      <div className="main-card">
        <h1>📊 AI Image Studio</h1>

        <p>
          Transform your images with AI-powered tools. Upload or capture photos,
          apply smart models, and download results instantly.
        </p>

        <div className="dashboard-grid">
          <div className="card">🎨 Studio<br/><span>Process images instantly</span></div>
          <div className="card">🧠 Models<br/><span>8 AI transformations</span></div>
          <div className="card">📂 History<br/><span>Track processed images</span></div>
          <div className="card">⚙️ Settings<br/><span>Customize experience</span></div>
        </div>

        <div className="dashboard-extra">
          <div className="card">⚡ Fast Processing</div>
          <div className="card">📸 Camera Support</div>
          <div className="card">💾 Download Results</div>
        </div>
      </div>
    </div>
  );
}

/* ================= MODELS ================= */
function Models() {
  const models = [
    ["Blur 🌀","Smoothens image"],
    ["Edge Detection ✏️","Detect edges"],
    ["Greyscale ⚫","Black & white"],
    ["Sharpen 🔍","Enhance clarity"],
    ["Brightness 🌞","Increase brightness"],
    ["Invert 🎨","Invert colors"],
    ["Color Enhance 🌈","Boost colors"],
    ["Background Removal 🧩","Remove background"]
  ];

  return (
    <div className="main-card">
      <h1>🧩 Models</h1>
      <p className="tagline">Explore powerful AI transformations</p>

      <div className="models-grid">
        {models.map((m,i)=>(
          <div key={i} className="model-card">
            <h3>{m[0]}</h3>
            <p>{m[1]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STUDIO ================= */
function Studio({ history, setHistory }) {
  const [img,setImg]=useState(null);
  const [out,setOut]=useState(null);
  const [model,setModel]=useState("Blur");

  const fileRef=useRef();
  const videoRef=useRef();
  const [cam,setCam]=useState(false);

  const models=["Blur","Greyscale","Brightness","Invert","Color Enhance","Sharpen"];

  const startCam=async()=>{
    setCam(true);
    const stream=await navigator.mediaDevices.getUserMedia({video:true});
    videoRef.current.srcObject=stream;
  };

  const capture=()=>{
    const c=document.createElement("canvas");
    c.width=videoRef.current.videoWidth;
    c.height=videoRef.current.videoHeight;
    c.getContext("2d").drawImage(videoRef.current,0,0);
    setImg({url:c.toDataURL()});
  };

  const upload=(e)=>{
    const f=e.target.files[0];
    if(f) setImg({url:URL.createObjectURL(f)});
  };

  const process=()=>{
    if(!img) return;

    const image=new Image();
    image.src=img.url;

    image.onload=()=>{
      const canvas=document.createElement("canvas");
      canvas.width=image.width;
      canvas.height=image.height;
      const ctx=canvas.getContext("2d");

      switch(model){
        case "Blur": ctx.filter="blur(4px)"; break;
        case "Greyscale": ctx.filter="grayscale(100%)"; break;
        case "Brightness": ctx.filter="brightness(1.4)"; break;
        case "Invert": ctx.filter="invert(100%)"; break;
        case "Color Enhance": ctx.filter="contrast(1.4) saturate(1.6)"; break;
        case "Sharpen": ctx.filter="contrast(1.5)"; break;
        default: break;
      }

      ctx.drawImage(image,0,0);

      const result=canvas.toDataURL();
      setOut(result);
      setHistory(prev=>[...prev,{before:img.url,after:result}]);
    };
  };

  const download=()=>{
    const a=document.createElement("a");
    a.href=out;
    a.download="image.png";
    a.click();
  };

  return (
    <div className="main-card">
      <h1>🎨 Studio</h1>
      <p>✨ Transform your photo with AI models</p>

      <div className="studio-controls">
        <input type="file" hidden ref={fileRef} onChange={upload}/>
        <button onClick={()=>fileRef.current.click()}>Upload</button>

        {!cam && <button onClick={startCam}>Camera</button>}
        {cam && <button onClick={capture}>Capture</button>}

        <select onChange={(e)=>setModel(e.target.value)}>
          {models.map((m,i)=><option key={i}>{m}</option>)}
        </select>

        <button onClick={process}>Process</button>
      </div>

      {/* Camera preview */}
      {cam && (
        <div className="camera-preview">
          <video ref={videoRef} autoPlay/>
        </div>
      )}

      <div className="studio-grid">
        {img && (
          <div className="image-card">
            <h3>Before</h3>
            <img src={img.url}/>
          </div>
        )}

        {out && (
          <div className="image-card">
            <h3>After</h3>
            <img src={out}/>
          </div>
        )}
      </div>

      {out && (
        <div className="download-center">
          <button onClick={download}>Download Result</button>
        </div>
      )}
    </div>
  );
}

/* ================= HISTORY ================= */
function History({ history }) {
  return (
    <div className="main-card">
      <h1>📂 History</h1>

      <div className="history-grid">
        {history.map((h,i)=>(
          <div key={i} className="history-card">
            <h3>#{i+1}</h3>
            <div className="history-row">
              <img src={h.before}/>
              <img src={h.after}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= SETTINGS ================= */
function Settings() {
  const [dark,setDark]=useState(true);
  const [anim,setAnim]=useState(true);

  return (
    <div className="main-card">
      <h1>⚙️ Settings</h1>

      <div className="settings-grid">
        <div className="card">
          <input type="checkbox" checked={dark} onChange={()=>setDark(!dark)}/>
          Dark Mode
        </div>

        <div className="card">
          <input type="checkbox" checked={anim} onChange={()=>setAnim(!anim)}/>
          Animations
        </div>
      </div>
    </div>
  );
}

/* ================= APP ================= */
function App() {
  const [logged,setLogged]=useState(false);
  const [history,setHistory]=useState([]);

  if(!logged) return <Login onLogin={setLogged}/>;

  return (
    <Router>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard"/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/models" element={<Models/>}/>
          <Route path="/studio" element={<Studio history={history} setHistory={setHistory}/>}/>
          <Route path="/history" element={<History history={history}/>}/>
          <Route path="/settings" element={<Settings/>}/>
        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;