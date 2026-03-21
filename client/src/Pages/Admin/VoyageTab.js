import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Table, Badge, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { createVoyage, updateVoyage, deleteVoyage, getAllVoyages } from "../../JS/Actions/voyage";
import MultiImageUpload from "../../Components/MultiImageUpload";

const initVoyage = {
  title: "", destination: "", departureDate: "", returnDate: "",
  price: "", description: "", images: [], isFeatured: false,
};

const VoyageTab = ({ voyages, destinations, loadVoyage }) => {
  const dispatch = useDispatch();

  const [voyageForm,   setVoyageForm]   = useState(initVoyage);
  const [editVoyageId, setEditVoyageId] = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [uploading,    setUploading]    = useState(false);

  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoTarget,    setPromoTarget]    = useState(null);
  const [promoForm,      setPromoForm]      = useState({ reduction: 10, dateExpiration: "" });
  const [promoLoading,   setPromoLoading]   = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoyageForm({ ...voyageForm, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editVoyageId) {
      dispatch(updateVoyage(editVoyageId, voyageForm));
    } else {
      dispatch(createVoyage(voyageForm));
    }
    setVoyageForm(initVoyage);
    setEditVoyageId(null);
    setShowModal(false);
  };

  const handleEdit = (v) => {
    setVoyageForm({
      title: v.title,
      destination: v.destination?._id || v.destination,
      departureDate: v.departureDate?.slice(0, 10),
      returnDate: v.returnDate?.slice(0, 10),
      price: v.price,
      description: v.description,
      images: v.images || [],
      isFeatured: v.isFeatured,
    });
    setEditVoyageId(v._id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce voyage ?")) dispatch(deleteVoyage(id));
  };

  const openAdd = () => {
    setVoyageForm(initVoyage);
    setEditVoyageId(null);
    setShowModal(true);
  };

  const openPromo = (v) => {
    setPromoTarget(v);
    setPromoForm({
      reduction: v.promotion?.reduction || 10,
      dateExpiration: v.promotion?.dateExpiration?.slice(0, 10) || "",
    });
    setShowPromoModal(true);
  };

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    setPromoLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/voyage/promotion/${promoTarget._id}`,
        { actif: true, reduction: Number(promoForm.reduction), dateExpiration: promoForm.dateExpiration },
        { headers: { authorization: token } }
      );
      dispatch(getAllVoyages());
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
        `/api/voyage/promotion/${id}`,
        { actif: false, reduction: 0 },
        { headers: { authorization: token } }
      );
      dispatch(getAllVoyages());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Liste des Voyages</h4>
        <Button variant="success" onClick={openAdd}>+ Ajouter Voyage</Button>
      </div>

      {loadVoyage ? <p>Chargement...</p> : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Titre</th><th>Destination</th><th>Départ</th><th>Retour</th>
              <th>Prix</th><th>Promo</th><th>Featured</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {voyages.map((v) => (
              <tr key={v._id}>
                <td>{v.title}</td>
                <td>{v.destination?.nom || "—"}</td>
                <td>{v.departureDate?.slice(0, 10)}</td>
                <td>{v.returnDate?.slice(0, 10)}</td>
                <td>{v.price} TND</td>
                <td>
                  {v.promotion?.actif
                    ? <Badge bg="danger">-{v.promotion.reduction}% → {v.promotion.prixPromo} DT</Badge>
                    : <Badge bg="secondary">Aucune</Badge>}
                </td>
                <td>
                  <Badge bg={v.isFeatured ? "success" : "secondary"}>
                    {v.isFeatured ? "Oui" : "Non"}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    <Button variant="warning" size="sm" onClick={() => handleEdit(v)}>✏️</Button>
                    <Button variant="danger"  size="sm" onClick={() => handleDelete(v._id)}>🗑️</Button>
                    {v.promotion?.actif
                      ? <Button variant="outline-danger"  size="sm" onClick={() => handleRemovePromo(v._id)}>❌ Promo</Button>
                      : <Button variant="outline-success" size="sm" onClick={() => openPromo(v)}>🏷️ Offre</Button>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ── MODAL VOYAGE ── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editVoyageId ? "Modifier Voyage" : "Ajouter Voyage"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre</Form.Label>
                  <Form.Control name="title" value={voyageForm.title} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination</Form.Label>
                  <Form.Select name="destination" value={voyageForm.destination} onChange={handleChange} required>
                    <option value="">-- Choisir --</option>
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>{d.nom} - {d.paye}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de départ</Form.Label>
                  <Form.Control type="date" name="departureDate" value={voyageForm.departureDate} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de retour</Form.Label>
                  <Form.Control type="date" name="returnDate" value={voyageForm.returnDate} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix (TND)</Form.Label>
                  <Form.Control type="number" name="price" value={voyageForm.price} onChange={handleChange} min={0} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check type="checkbox" label="Featured ?" name="isFeatured"
                    checked={voyageForm.isFeatured} onChange={handleChange} className="mt-4" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={voyageForm.description} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Photos <small className="text-muted">(la 1ère sera la photo principale)</small></Form.Label>
                  <MultiImageUpload
                    images={voyageForm.images}
                    onUpdate={(imgs) => setVoyageForm({ ...voyageForm, images: imgs })}
                    onLoading={(val) => setUploading(val)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button variant="success" type="submit" disabled={uploading}>
                {uploading ? "Upload en cours..." : editVoyageId ? "Modifier" : "Ajouter"}
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
                <strong>{promoTarget.title}</strong> — Prix actuel : <strong>{promoTarget.price} DT</strong>
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
                      Prix promo : {Math.round(promoTarget.price * (1 - promoForm.reduction / 100))} DT
                      {" — "}économie : {Math.round(promoTarget.price * promoForm.reduction / 100)} DT
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
                  <Button variant="success" type="submit" disabled={promoLoading}>
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

export default VoyageTab;