import { useState } from "react";
import axios from "axios";
import "./UploadPDF.css"; // Ensure you have this CSS file
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { useInterview } from "../context/InterviewContext";

const UploadPDF = () => {
  const { text, setText } = useInterview();
  const [file, setFile] = useState(null);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pdf/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": token, // Include the JWT token
          },
        }
      );

      localStorage.setItem("text", response.data.text);
      setText(localStorage.getItem("text"));
      alert("Resume text extracted successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload and extract text.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        <h2>Upload PDF to Extract Text</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button type="submit">Upload and Extract Text</button>
        </form>
        {text && (
          <div className="text-output">
            <h3>Extracted Text:</h3>
            <pre>{text}</pre>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadPDF;
