import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("grayscale");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
      setProcessedImage(null);
    }
  };
  
   const handleUpload = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", model);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
        { responseType: "blob" }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);

    } catch (error) {
      alert("Processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>AI Image Processing Studio</h1>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={styles.input}
        />
        <div style={styles.modelContainer}>
  {[
    { id: "grayscale", label: "Grayscale", icon: "🖤" },
    { id: "blur", label: "Blur", icon: "🌫" },
    { id: "edges", label: "Edge Detection", icon: "🔍" }
  ].map((item) => (
    <div
      key={item.id}
      onClick={() => setModel(item.id)}
      style={{
        ...styles.modelCard,
        border: model === item.id ? "2px solid #1976d2" : "2px solid transparent",
        transform: model === item.id ? "scale(1.05)" : "scale(1)"
      }}
    >
      <div style={styles.modelIcon}>{item.icon}</div>
      <div style={styles.modelText}>{item.label}</div>
    </div>
  ))}
</div>

        <button onClick={handleUpload} 
        style={{
          ...styles.button,
          opacity: loading ? 0.6 : 1
          }} disabled={loading}
          >
          {loading ? "Processing..." : "Process Image"}
        </button> 

        {loading && <p style={styles.loading}>Processing image...</p>}

        {preview && processedImage && (
          <div style={styles.compareSection}>
            <h2>Before vs After</h2>

            <div style={styles.imageRow}>
              <div style={styles.imageCard}>
                <p>Original</p>
                <img src={preview} alt="original" style={styles.image} />
              </div>

              <div style={styles.imageCard}>
  <p>Processed</p>
  <img src={processedImage} alt="processed" style={styles.image} />

  <a
    href={processedImage}
    download="processed-image.png"
    style={{ textDecoration: "none" }}
  >
    <button style={styles.downloadButton}>
      Download Image
    </button>
  </a>
</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(-45deg, #667eea, #764ba2, #6b73ff, #00c6ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: 20,
  },

  card: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: "100%",
    maxWidth: "580px",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },

  title: {
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    marginBottom: "15px",
  },

  dropdown: {
    borderRadius: "6px",
    padding: "8px",
    marginBottom: "15px",
  },

  button: {
    padding: "10px 20px",
    background: "#1976d2",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "16px",
  },

  loading: {
    marginTop: "15px",
    fontWeight: "bold",
  },

  compareContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },

  imageRow: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },

  imagecard: {
    background: "#fafafa",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },

  modelContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },
  modelCard: {
    width: "130px",
    padding: "15px",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  
  modelIcon: {
    fontSize: "28px",
    marginBottom: "8px",
  },

  modelText: {
    fontSize: "14px",
    marginBottom: "8px",
  },

  downloadButton: {
    padding: "8px 14px",
    background: "#28a745",
    marginTop: "10px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },

  image: {
    width: "200px",
    borderRadius: "8px",
  },
};

export default App;