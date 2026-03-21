import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";

const AnnonceCarousel = () => {
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    axios.get("/api/annonce")
      .then(res => setAnnonces(res.data))
      .catch(() => {});
  }, []);

  if (annonces.length === 0) return null;

  return (
    <Carousel
      slide={true}
      fade={true}
      indicators={annonces.length > 1}
      controls={annonces.length > 1}
      interval={4000}
    >
      {annonces.map((a) => (
        <Carousel.Item key={a._id}>
          {a.lien ? (
            <a href={a.lien} target="_blank" rel="noreferrer">
              <img
                src={a.image}
                alt="annonce"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "450px",
                  objectFit: "contain",
                  display: "block",
                  background: "#111",
                }}
              />
            </a>
          ) : (
            <img
              src={a.image}
              alt="annonce"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "450px",
                objectFit: "contain",
                display: "block",
                background: "#111",
              }}
            />
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default AnnonceCarousel;