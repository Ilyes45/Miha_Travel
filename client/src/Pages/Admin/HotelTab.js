import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Table, Badge, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { createHotel, updateHotel, deleteHotel, getAllHotels } from "../../JS/Actions/hotel";
import MultiImageUpload from "../../Components/MultiImageUpload";

const initHotel = {
  nom: "", destination: "", description: "", images: [],
  etoiles: 3, prix: "", adresse: "", isFeatured: false,
};

const HotelTab = ({ hotels, destinations, loadHotel }) => {
  const dispatch = useDispatch();

  const [hotelForm,   setHotelForm]   = useState(initHotel);
  const [editHotelId, setEditHotelId] = useState(null);
  const [showModal,   setShowModal]   = useState(false);
  const [uploading,   setUploading]   = useState(false);

  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoTarget,    setPromoTarget]    = useState(null);
  const [promoForm,      setPromoForm]      = useState({ reduction: 10, dateExpiration: "" });
  const [promoLoading,   setPromoLoading]   = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelForm({ ...hotelForm, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...hotelForm, etoiles: parseInt(hotelForm.etoiles) };
    if (editHotelId) {
      dispatch(updateHotel(editHotelId, data));
    } else {
      dispatch(createHotel(data));
    }
    setHotelForm(initHotel);
    setEditHotelId(null);
    setShowModal(false);
  };

  const handleEdit = (h) => {
    setHotelForm({
      nom: h.nom,
      destination: h.destination?._id || h.destination,
      description: h.description,
      images: h.images || [],
      etoiles: h.etoiles,
      prix: h.prix,
      adresse: h.adresse,
      isFeatured: h.isFeatured,
    });
    setEditHotelId(h._id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cet hôtel ?")) dispatch(deleteHotel(id));
  };

  const openAdd = () => {
    setHotelForm(initHotel);
    setEditHotelId(null);
    setShowModal(true);
  };

  const openPromo = (h) => {
    setPromoTarget(h);
    setPromoForm({
      reduction: h.promotion?.reduction || 10,
      dateExpiration: h.promotion?.dateExpiration?.slice(0, 10) || "",
    });
    setShowPromoModal(true);
  };

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    setPromoLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/hotel/promotion/${promoTarget._id}`,
        { actif: true, reduction: Number(promoForm.reduction), dateExpiration: promoForm.dateExpiration },
        { headers: { authorization: token } }
      );
      dispatch(getAllHotels());
      setShowPromoModal(false);
    } catch (err) {
      console.error("Erreur promotion", err);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = async (id) => {
    if (!window.confirm("Retirer la promotion ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/hotel/promotion/${id}`,
        { actif: false, reduction: 0 },
        { headers: { authorization: token } }
      );
      dispatch(getAllHotels());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Liste des Hôtels</h4>
        <Button variant="primary" onClick={openAdd}>+ Ajouter Hôtel</Button>
      </div>

      {loadHotel ? <p>Chargement...</p> : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Nom</th><th>Destination</th><th>Étoiles</th><th>Prix/nuit</th>
              <th>Promo</th><th>Featured</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((h) => (
              <tr key={h._id}>
                <td>{h.nom}</td>
                <td>{h.destination?.nom || "—"}</td>
                <td>{"⭐".repeat(h.etoiles)}</td>
                <td>{h.prix} TND</td>
                <td>
                  {h.promotion?.actif
                    ? <Badge bg="danger">-{h.promotion.reduction}% → {h.promotion.prixPromo} DT</Badge>
                    : <Badge bg="secondary">Aucune</Badge>}
                </td>
                <td>
                  <Badge bg={h.isFeatured ? "success" : "secondary"}>
                    {h.isFeatured ? "Oui" : "Non"}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    <Button variant="warning" size="sm" onClick={() => handleEdit(h)}>✏️</Button>
                    <Button variant="danger"  size="sm" onClick={() => handleDelete(h._id)}>🗑️</Button>
                    {h.promotion?.actif
                      ? <Button variant="outline-danger"  size="sm" onClick={() => handleRemovePromo(h._id)}>❌ Promo</Button>
                      : <Button variant="outline-success" size="sm" onClick={() => openPromo(h)}>🏷️ Offre</Button>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ── MODAL HOTEL ── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editHotelId ? "Modifier Hôtel" : "Ajouter Hôtel"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control name="nom" value={hotelForm.nom} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination</Form.Label>
                  <Form.Select name="destination" value={hotelForm.destination} onChange={handleChange} required>
                    <option value="">-- Choisir --</option>
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>{d.nom} - {d.paye}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Étoiles</Form.Label>
                  <Form.Select name="etoiles" value={hotelForm.etoiles} onChange={handleChange} required>
                    {[1,2,3,4,5].map((n) => (
                      <option key={n} value={n}>{"⭐".repeat(n)}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix / nuit (TND)</Form.Label>
                  <Form.Control type="number" name="prix" value={hotelForm.prix} onChange={handleChange} min={0} required />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control name="adresse" value={hotelForm.adresse} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={hotelForm.description} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Photos <small className="text-muted">(la 1ère sera la photo principale)</small></Form.Label>
                  <MultiImageUpload
                    images={hotelForm.images}
                    onUpdate={(imgs) => setHotelForm({ ...hotelForm, images: imgs })}
                    onLoading={(val) => setUploading(val)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Check type="checkbox" label="Featured ?" name="isFeatured"
                    checked={hotelForm.isFeatured} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button variant="primary" type="submit" disabled={uploading}>
                {uploading ? "Upload en cours..." : editHotelId ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ── MODAL PROMOTION ── */}
      <Modal show={showPromoModal} onHide={() => setShowPromoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🏷️ Mettre en promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {promoTarget && (
            <>
              <p className="mb-3">
                <strong>{promoTarget.nom}</strong> — Prix actuel : <strong>{promoTarget.prix} DT</strong>
              </p>
              <Form onSubmit={handlePromoSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Réduction (%)</Form.Label>
                  <Form.Control type="number" min={1} max={90}
                    value={promoForm.reduction}
                    onChange={(e) => setPromoForm({ ...promoForm, reduction: e.target.value })}
                    required />
                  {promoForm.reduction > 0 && (
                    <Form.Text className="text-success fw-bold">
                      Prix promo : {Math.round(promoTarget.prix * (1 - promoForm.reduction / 100))} DT
                      {" — "}économie : {Math.round(promoTarget.prix * promoForm.reduction / 100)} DT
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date d'expiration</Form.Label>
                  <Form.Control type="date"
                    value={promoForm.dateExpiration}
                    onChange={(e) => setPromoForm({ ...promoForm, dateExpiration: e.target.value })}
                    required />
                </Form.Group>
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={() => setShowPromoModal(false)}>Annuler</Button>
                  <Button variant="primary" type="submit" disabled={promoLoading}>
                    {promoLoading ? "Enregistrement..." : "✓ Confirmer"}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HotelTab;