import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Badge, Button, Spinner } from "react-bootstrap";
import { getAllReservations, updateStatut, deleteReservation } from "../../JS/Actions/reservation";

const statutBadge = (statut) => {
  if (statut === "en_attente") return <Badge bg="warning" text="dark">⏳ En attente</Badge>;
  if (statut === "confirmee")  return <Badge bg="success">✅ Confirmée</Badge>;
  if (statut === "annulee")    return <Badge bg="danger">❌ Annulée</Badge>;
};

const ReservationTab = () => {
  const dispatch = useDispatch();
  const { reservations, loadReservation } = useSelector((s) => s.reservationReducer);

  useEffect(() => {
    dispatch(getAllReservations());
  }, [dispatch]);

  const handleStatut = (id, statut) => dispatch(updateStatut(id, statut));

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette réservation ?")) dispatch(deleteReservation(id));
  };

  if (loadReservation) return (
    <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Liste des Réservations</h4>
        <span className="text-muted">{reservations.length} réservation(s)</span>
      </div>

      {reservations.length === 0 ? (
        <p className="text-muted">Aucune réservation pour le moment.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Client</th>
              <th>Téléphone</th>
              <th>Type</th>
              <th>Voyage / Hôtel</th>
              <th>Du</th>
              <th>Au</th>
              <th>Personnes</th>
              <th>Prix total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => {
              const nom = r.type === "voyage" ? r.voyage?.title : r.hotel?.nom;
              return (
                <tr key={r._id}>
                  <td>
                    <div className="fw-bold">{r.user?.nom}</div>
                    <small className="text-muted">{r.user?.email}</small>
                  </td>
                  <td>
                    <a href={`tel:${r.telephone}`} className="text-decoration-none">
                      📞 {r.telephone || "—"}
                    </a>
                  </td>
                  <td>
                    <Badge bg={r.type === "voyage" ? "primary" : "info"}>
                      {r.type === "voyage" ? "✈️ Voyage" : "🏨 Hôtel"}
                    </Badge>
                  </td>
                  <td>{nom || "—"}</td>
                  <td>{new Date(r.dateDebut).toLocaleDateString("fr-FR")}</td>
                  <td>{new Date(r.dateFin).toLocaleDateString("fr-FR")}</td>
                  <td className="text-center">{r.nombrePersonnes}</td>
                  <td className="fw-bold text-primary">{r.prixTotal} TND</td>
                  <td>{statutBadge(r.statut)}</td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      {r.statut === "en_attente" && (
                        <Button variant="success" size="sm" onClick={() => handleStatut(r._id, "confirmee")}>
                          ✅ Confirmer
                        </Button>
                      )}
                      {r.statut !== "annulee" && (
                        <Button variant="warning" size="sm" onClick={() => handleStatut(r._id, "annulee")}>
                          ❌ Annuler
                        </Button>
                      )}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(r._id)}>
                        🗑️ Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ReservationTab;