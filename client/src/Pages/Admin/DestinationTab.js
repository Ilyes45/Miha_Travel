import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Table,  Modal, Form } from "react-bootstrap";
import { createDestination, updateDestination, deleteDestination } from "../../JS/Actions/destination";
import ImageUpload from "../../Components/ImageUpload";

const initDest = { nom: "", paye: "", description: "", image: "" };


const DestinationTab = ({ destinations, loadDestination }) => {
  const dispatch = useDispatch();
  const [destForm, setDestForm] = useState(initDest);
  const [editDestId, setEditDestId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDestForm({ ...destForm, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editDestId) {
      dispatch(updateDestination(editDestId, destForm));
    } else {
      dispatch(createDestination(destForm));
    }
    setDestForm(initDest);
    setEditDestId(null);
    setShowModal(false);
  };

  const handleEdit = (dest) => {
    setDestForm({ nom: dest.nom, paye: dest.paye, description: dest.description, image: dest.image, isFeatured: dest.isFeatured });
    setEditDestId(dest._id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette destination ?")) dispatch(deleteDestination(id));
  };

  const openAdd = () => {
    setDestForm(initDest);
    setEditDestId(null);
    setShowModal(true);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Liste des Destinations</h4>
        <Button variant="primary" onClick={openAdd}>+ Ajouter Destination</Button>
      </div>

      {loadDestination ? <p>Chargement...</p> : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Image</th><th>Nom</th><th>Pays</th><th>Description</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((dest) => (
              <tr key={dest._id}>
                <td>
                  <img src={dest.image} alt={dest.nom} style={{ width: 60, height: 50, objectFit: "cover", borderRadius: 6 }} />
                </td>
                <td>{dest.nom}</td>
                <td>{dest.paye}</td>
                <td>{dest.description.slice(0, 50)}...</td>
               
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(dest)}>✏️ Modifier</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(dest._id)}>🗑️ Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editDestId ? "Modifier Destination" : "Ajouter Destination"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control name="nom" value={destForm.nom} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pays</Form.Label>
              <Form.Control name="paye" value={destForm.paye} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={destForm.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Image</Form.Label>
  <ImageUpload
    currentImage={destForm.image}
    onUpload={(url) => setDestForm({ ...destForm, image: url })}
  />
</Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button variant="primary" type="submit">{editDestId ? "Modifier" : "Ajouter"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DestinationTab;