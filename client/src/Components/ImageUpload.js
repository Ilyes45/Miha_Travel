import React, { useState } from "react";
import { Form, Image, Spinner } from "react-bootstrap";
import { uploadImage } from "../JS/Actions/upload";

const ImageUpload = ({ onUpload, currentImage }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // preview local immédiat
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const url = await uploadImage(file);
      onUpload(url);  // envoie l'URL au parent
    } catch (error) {
      console.error("Erreur upload", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form.Control type="file" accept="image/*" onChange={handleChange} />
      {loading && <Spinner animation="border" size="sm" className="mt-2" />}
      {preview && !loading && (
        <Image
          src={preview}
          alt="preview"
          className="mt-2"
          style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8 }}
        />
      )}
    </div>
  );
};

export default ImageUpload;