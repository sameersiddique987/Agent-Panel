import React, { useState, useEffect } from "react";
import { uploadPopupImage, fetchPopupImage } from "../api";

const PopupManager = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const loadImage = async () => {
      const response = await fetchPopupImage();
      setImageUrl(response.imageUrl);
    };
    loadImage();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const response = await uploadPopupImage(file);
    setMessage(response.message);
    setImageUrl(response.imageUrl); // Update image URL after upload
  };

  return (
    <div>
      <h2>Upload Popup Image</h2>
      <input type="file" onChange={(e) => {
        if (e.target.files && e.target.files.length > 0) {
          setFile(e.target.files[0]);
        }
      }} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
      {imageUrl && <img src={imageUrl} alt="Popup" />}
    </div>
  );
};

export default PopupManager;