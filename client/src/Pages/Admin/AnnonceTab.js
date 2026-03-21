import React, { useState, useEffect } from "react";
import { Button, Table, Badge, Modal, Form } from "react-bootstrap";
import axios from "axios";
import MultiImageUpload from "../../Components/MultiImageUpload";

const AnnonceTab = () => {
  const [annonces,  setAnnonces]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form,      setForm]      = useState({ image: "", lien: "", actif: true });

  const token  = localStorage.getItem("token");
  const config = { headers: { authorization: token } };

  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/annonce/all", config);
      setAnnonces(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token  = localStorage.getItem("token");
    const config = { headers: { authorization: token } };

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/annonce/all", config);
        setAnnonces(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const openAdd = () => {
    setForm({ image: "", lien: "", actif: true });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (a) => {
    setForm({ image: a.image, lien: a.lien || "", actif: a.actif });
    setEditId(a._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/annonce/${editId}`, form, config);
      } else {
        await axios.post("/api/annonce", form, config);
      }
      fetchAnnonces();
      setShowModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette annonce ?")) return;
    try {
      await axios.delete(`/api/annonce/${id}`, config);
      fetchAnnonces();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleActif = async (a) => {
    try {
      await axios.put(`/api/annonce/${a._id}`, { ...a, actif: !a.actif }, config);
      fetchAnnonces();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>📢 Annonces Publicitaires</h4>
        <Button variant="danger" onClick={openAdd}>+ Ajouter Annonce</Button>
      </div>

      {loading ? <p>Chargement...</p> : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Image</th><th>Lien</th><th>Statut</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {annonces.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-muted">Aucune annonce</td></tr>
            ) : annonces.map((a) => (
              <tr key={a._id}>
                <td>
                  <img src={a.image} alt="annonce"
                    style={{ height: 60, width: 120, objectFit: "cover", borderRadius: 6 }} />
                </td>
                <td>
                  {a.lien
                    ? <a href={a.lien} target="_blank" rel="noreferrer">{a.lien.slice(0, 30)}...</a>
                    : <span className="text-muted">—</span>
                  }
                </td>
                <td>
                  <Badge
                    bg={a.actif ? "success" : "secondary"}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleActif(a)}
                  >
                    {a.actif ? "✅ Active" : "⏸ Inactive"}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button variant="warning" size="sm" onClick={() => openEdit(a)}>✏️ Modifier</Button>
                    <Button variant="danger"  size="sm" onClick={() => handleDelete(a._id)}>🗑️ Supprimer</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Modifier Annonce" : "Ajouter Annonce"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <MultiImageUpload
                images={form.image ? [form.image] : []}
                onUpdate={(imgs) => setForm({ ...form, image: imgs[0] || "" })}
                onLoading={(val) => setUploading(val)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lien (optionnel)</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://..."
                value={form.lien}
                onChange={(e) => setForm({ ...form, lien: e.target.value })}
              />
              <Form.Text className="text-muted">Si rempli, l'image sera cliquable</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active ?"
                checked={form.actif}
                onChange={(e) => setForm({ ...form, actif: e.target.checked })}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button variant="danger" type="submit" disabled={uploading || !form.image}>
                {uploading ? "Upload..." : editId ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AnnonceTab;