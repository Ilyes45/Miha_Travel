import React, { useState } from "react";
import { Button, Spinner, Row, Col } from "react-bootstrap";
import { uploadImage } from "../JS/Actions/upload";

const MultiImageUpload = ({ images = [], onUpdate, onLoading }) => {
  const [uploading, setUploading] = useState(false);

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    if (onLoading) onLoading(true);

    try {
      const url = await uploadImage(file);
      onUpdate([...images, url]); // ajoute au tableau
    } catch (error) {
      console.error("Erreur upload", error);
    } finally {
      setUploading(false);
      if (onLoading) onLoading(false);
      e.target.value = ""; // reset input pour permettre re-upload même fichier
    }
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onUpdate(newImages);
  };

  return (
    <div>
      {/* ─── PREVIEW DES IMAGES ────────────────────────── */}
      {images.length > 0 && (
        <Row className="g-2 mb-3">
          {images.map((img, i) => (
            <Col key={i} xs={4} style={{ position: "relative" }}>
              <img
                src={img}
                alt={`photo-${i}`}
                style={{
                  width: "100%",
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "2px solid #dee2e6"
                }}
              />
              {/* bouton supprimer */}
              <Button
                type="button"
                onClick={() => handleRemove(i)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 8,
                  background: "rgba(220,53,69,0.85)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </Button>
              {i === 0 && (
                <span style={{
                  position: "absolute",
                  bottom: 6,
                  left: 10,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  fontSize: "0.65rem",
                  padding: "1px 5px",
                  borderRadius: 4,
                }}>
                  Principale
                </span>
              )}
            </Col>
          ))}
        </Row>
      )}

      {/* ─── BOUTON AJOUTER ────────────────────────────── */}
      <div className="d-flex align-items-center gap-3">
        <label
          style={{
            cursor: uploading ? "not-allowed" : "pointer",
            background: uploading ? "#6c757d" : "#0d6efd",
            color: "white",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: "0.9rem",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {uploading ? (
            <><Spinner animation="border" size="sm" /> Upload...</>
          ) : (
            <>📷 Ajouter une photo</>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
        <small className="text-muted">{images.length} photo(s)</small>
      </div>
    </div>
  );
};

export default MultiImageUpload;