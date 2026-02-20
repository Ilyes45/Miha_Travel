import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Table, Badge, Modal, Form, Row, Col } from "react-bootstrap";
import { createVoyage, updateVoyage, deleteVoyage } from "../../JS/Actions/voyage";
import ImageUpload from "../../Components/ImageUpload";

const initVoyage = {
  title: "",
  destination: "",
  departureDate: "",
  returnDate: "",
  price: "",
  description: "",
  images: [],
  isFeatured: false,
};

const VoyageTab = ({ voyages, destinations, loadVoyage }) => {
  const dispatch = useDispatch();
  const [voyageForm, setVoyageForm] = useState(initVoyage);
  const [editVoyageId, setEditVoyageId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoyageForm({ ...voyageForm, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...voyageForm };
    if (editVoyageId) {
      dispatch(updateVoyage(editVoyageId, data));
    } else {
      dispatch(createVoyage(data));
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Liste des Voyages</h4>
        <Button variant="success" onClick={openAdd}>+ Ajouter Voyage</Button>
      </div>

      {loadVoyage ? (
        <p>Chargement...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              
              <th>Titre</th>
              <th>Destination</th>
              <th>Départ</th>
              <th>Retour</th>
              <th>Prix</th>
              <th>Featured</th>
              <th>Actions</th>
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
                  <Badge bg={v.isFeatured ? "success" : "secondary"}>
                    {v.isFeatured ? "Oui" : "Non"}
                  </Badge>
                </td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(v)}>
                    ✏️ Modifier
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(v._id)}>
                    🗑️ Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* MODAL */}
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
                  <Form.Control
                    name="title"
                    value={voyageForm.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination</Form.Label>
                  <Form.Select
                    name="destination"
                    value={voyageForm.destination}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Choisir une destination --</option>
                    {destinations.map((dest) => (
                      <option key={dest._id} value={dest._id}>
                        {dest.nom} - {dest.paye}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de départ</Form.Label>
                  <Form.Control
                    type="date"
                    name="departureDate"
                    value={voyageForm.departureDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de retour</Form.Label>
                  <Form.Control
                    type="date"
                    name="returnDate"
                    value={voyageForm.returnDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix (TND)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={voyageForm.price}
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image principale</Form.Label>
                  <ImageUpload
                    currentImage={voyageForm.images?.[0] || null}
                    onUpload={(url) => setVoyageForm({ ...voyageForm, images: [url] })}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={voyageForm.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Featured ?"
                    name="isFeatured"
                    checked={voyageForm.isFeatured}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button variant="success" type="submit">
                {editVoyageId ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VoyageTab;