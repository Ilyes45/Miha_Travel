import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button, Spinner } from "react-bootstrap";
import { getAllVoyages } from "../../JS/Actions/voyage";
import { getAllHotels } from "../../JS/Actions/hotel";
import VoyageList from "../../Components//VoyageList/VoyageList";
import HotelList from "../../Components//HotelList/HotelList";
import "./Accueil.css";

const Accueil = () => {
  const dispatch = useDispatch();
  const { voyages, loadVoyage } = useSelector((s) => s.voyageReducer);
  const { hotels, loadHotel } = useSelector((s) => s.hotelReducer);

  useEffect(() => {
    dispatch(getAllVoyages());
    dispatch(getAllHotels());
  }, [dispatch]);

  const featuredVoyages = voyages.filter((v) => v.isFeatured);
  const featuredHotels = hotels.filter((h) => h.isFeatured);

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <div className="hero">
        <Container>
          <h1>✈️ Miha Travel</h1>
          <p>Découvrez les plus belles destinations du monde</p>
          <Button variant="warning" size="lg" className="mt-3 fw-bold">
            Explorer les voyages
          </Button>
        </Container>
      </div>

      <Container className="py-5">

        {/* ─── VOYAGES ───────────────────────────────────────── */}
        {loadVoyage ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {featuredVoyages.length > 0 && (
              <>
                <h2 className="section-title">⭐ Voyages à la une</h2>
                <VoyageList voyages={featuredVoyages} featured />
                <hr className="my-5" />
              </>
            )}
            <h2 className="section-title">✈️ Tous nos voyages</h2>
            <VoyageList voyages={voyages} />
          </>
        )}

        <hr className="my-5" />

        {/* ─── HOTELS ────────────────────────────────────────── */}
        {loadHotel ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {featuredHotels.length > 0 && (
              <>
                <h2 className="section-title">⭐ Hôtels à la une</h2>
                <HotelList hotels={featuredHotels} featured />
                <hr className="my-5" />
              </>
            )}
            <h2 className="section-title">🏨 Nos hôtels</h2>
            <HotelList hotels={hotels} />
          </>
        )}

      </Container>
    </div>
  );
};

export default Accueil;