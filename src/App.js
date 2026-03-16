import React, { useState, useRef } from "react";
import "./App.css";

function App() {

const [page,setPage] = useState("landing");

const [image,setImage] = useState(null);
const [processedImage,setProcessedImage] = useState(null);

const [model,setModel] = useState("grayscale");
const [appliedFilter,setAppliedFilter] = useState(null);

const [loading,setLoading] = useState(false);

const videoRef = useRef(null);
const canvasRef = useRef(null);


/* FILTER STYLES */

const modelStyles = {

grayscale:"grayscale(100%)",
sepia:"sepia(100%)",
invert:"invert(100%)",
blur:"blur(4px)",
brightness:"brightness(140%)",
contrast:"contrast(180%)",
saturate:"saturate(180%)"

};


/* START CAMERA */

const startCamera = async ()=>{

const stream = await navigator.mediaDevices.getUserMedia({video:true});

videoRef.current.srcObject = stream;

};


/* CAPTURE IMAGE */

const captureImage = ()=>{

const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");

canvas.width = videoRef.current.videoWidth;
canvas.height = videoRef.current.videoHeight;

ctx.drawImage(videoRef.current,0,0);

const data = canvas.toDataURL("image/png");

setImage(data);
setProcessedImage(null);
setAppliedFilter(null);

};


/* IMAGE UPLOAD */

const handleUpload = (e)=>{

const file = e.target.files[0];
if(!file) return;

const reader = new FileReader();

reader.onload = ()=>{
setImage(reader.result);
setProcessedImage(null);
setAppliedFilter(null);
};

reader.readAsDataURL(file);

};


/* EDGE DETECTION */

const edgeDetect = (imgSrc)=>{

const img = new Image();
img.src = imgSrc;

img.onload = ()=>{

const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");

canvas.width = img.width;
canvas.height = img.height;

ctx.drawImage(img,0,0);

let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
let data = imageData.data;

for(let i=0;i<data.length;i+=4){

let avg = (data[i]+data[i+1]+data[i+2])/3;

data[i] = avg>120 ? 255 : 0;
data[i+1] = avg>120 ? 255 : 0;
data[i+2] = avg>120 ? 255 : 0;

}

ctx.putImageData(imageData,0,0);

setProcessedImage(canvas.toDataURL());
setAppliedFilter(null);

};

};


/* PROCESS IMAGE */

const handleProcess = ()=>{

if(!image) return;

setLoading(true);

setTimeout(()=>{

if(model==="edge"){

edgeDetect(image);

}else{

setProcessedImage(image);
setAppliedFilter(model);

}

setLoading(false);

},1500);

};


/* DOWNLOAD IMAGE */

const handleDownload = ()=>{

if(!processedImage) return;

const link = document.createElement("a");

link.href = processedImage;
link.download = "ai-image.png";

link.click();

};


return(

<div className="app-container">


{/* FLOATING GOLD BUBBLES */}

<div className="bubbles">
<span></span>
<span></span>
<span></span>
<span></span>
</div>


{/* LANDING PAGE */}

{page==="landing" &&(

<div className="glass-card">

<h1 className="main-title">✨ AI Image Studio</h1>

<p className="sub-text">
Luxury AI powered image enhancement platform
</p>

<div className="features">

<div className="feature-card">⚡ Instant Processing</div>
<div className="feature-card">🎨 AI Filters</div>
<div className="feature-card">📷 Live Camera</div>
<div className="feature-card">⬇ HD Download</div>

</div>

<button className="gold-btn" onClick={()=>setPage("about")}>
Explore Studio
</button>

</div>

)}


{/* ABOUT PAGE */}

{page==="about" &&(

<div className="glass-card">

<button className="back-btn" onClick={()=>setPage("landing")}>
← Back
</button>

<h2>About AI Image Studio</h2>

<p className="about-text">

AI Image Processing Lab is a smart platform that demonstrates how artificial intelligence can enhance digital images. Users can upload or capture images and apply multiple AI-powered filters such as grayscale conversion, brightness adjustment, contrast enhancement, and edge detection. The system showcases how modern AI and computer vision techniques can analyze and improve visual data in real time.

</p>

<div className="about-grid">

<div className="about-card">⚡ Real Time Processing</div>
<div className="about-card">📷 Camera Capture</div>
<div className="about-card">🧠 AI Filters</div>
<div className="about-card">⬇ HD Export</div>

</div>

<button className="gold-btn" onClick={()=>setPage("studio")}>
Launch Studio
</button>

</div>

)}


{/* STUDIO PAGE */}

{page==="studio" &&(

<div className="glass-card studio-card">

<button className="back-btn" onClick={()=>setPage("about")}>
← Back
</button>

<h2>AI Image Processing Lab</h2>


{/* CONTROLS */}

<div className="controls">

<input type="file" onChange={handleUpload}/>

<button className="gold-btn" onClick={startCamera}>
Start Camera
</button>

<button className="gold-btn" onClick={captureImage}>
Capture
</button>

</div>


{/* CAMERA */}

<div className="camera-area">

<video ref={videoRef} autoPlay></video>

<canvas ref={canvasRef} style={{display:"none"}}/>

</div>


{/* MODEL BAR */}

<div className="model-bar">

<select value={model} onChange={(e)=>setModel(e.target.value)}>

<option value="grayscale">Grayscale</option>
<option value="sepia">Sepia</option>
<option value="invert">Invert</option>
<option value="blur">Blur</option>
<option value="brightness">Brightness</option>
<option value="contrast">Contrast</option>
<option value="saturate">Saturate</option>
<option value="edge">Edge Detection</option>

</select>

<button className="gold-btn" onClick={handleProcess}>
Process
</button>

</div>


{/* LOADER */}

{loading && <div className="loader"></div>}


{/* RESULT SECTION */}

<div className="result-grid">


<div className="result-box">

<h3>Before</h3>

{image && <img src={image} alt="before"/>}

</div>


<div className="result-box">

<h3>After</h3>

{processedImage && !loading &&(

<>

<img
src={processedImage}
alt="after"
style={appliedFilter ? {filter:modelStyles[appliedFilter]}:{}}
/>

<button className="gold-btn" onClick={handleDownload}>
Download
</button>

</>

)}

</div>

</div>

</div>

)}

</div>

);

}

export default App;