import { useState } from "react";

function UploadBox() {
  const [file, setFile] = useState(null);
  const [responseMsg, setResponseMsg] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Select image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResponseMsg("Uploaded: " + data.filename);
    } catch (error) {
      setResponseMsg("Upload failed");
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload}>Upload</button>

      {responseMsg && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          {responseMsg}
        </p>
      )}
    </div>
  );
}

export default UploadBox;