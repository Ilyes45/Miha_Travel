import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Table, Badge, Modal, Form, Row, Col } from "react-bootstrap";
import { createHotel, updateHotel, deleteHotel } from "../../JS/Actions/hotel";
import MultiImageUpload from "../../Components/MultiImageUpload";

const initHotel = {
  nom: "",
  destination: "",
  description: "",
  images: [],
  etoiles: 3,
  prix: "",
  adresse: "",
  isFeatured: false,
};

const HotelTab = ({ hotels, destinations, loadHotel }) => {
  const dispatch = useDispatch();
  const [hotelForm, setHotelForm] = useState(initHotel);
  const [editHotelId, setEditHotelId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

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
              <th>Nom</th><th>Destination</th><th>Étoiles</th><th>Prix/nuit</th><th>Photos</th><th>Featured</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((h) => (
              <tr key={h._id}>
                <td>{h.nom}</td>
                <td>{h.destination?.nom || "—"}</td>
                <td>{"⭐".repeat(h.etoiles)}</td>
                <td>{h.prix} TND</td>
                <td>{h.images?.length || 0} photo(s)</td>
                <td>
                  <Badge bg={h.isFeatured ? "success" : "secondary"}>
                    {h.isFeatured ? "Oui" : "Non"}
                  </Badge>
                </td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(h)}>✏️ Modifier</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(h._id)}>🗑️ Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

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
                    {[1, 2, 3, 4, 5].map((n) => (
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
                  <Form.Check type="checkbox" label="Featured ?" name="isFeatured" checked={hotelForm.isFeatured} onChange={handleChange} />
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
    </>
  );
};

export default HotelTab;