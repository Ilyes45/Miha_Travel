import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Tabs, Tab } from "react-bootstrap";
import { getAllDestinations } from "../../JS/Actions/destination";
import { getAllVoyages } from "../../JS/Actions/voyage";
import AdminStats from "./AdminStats";
import DestinationTab from "./DestinationTab";
import VoyageTab from "./VoyageTab";

const Admin = () => {
  const dispatch = useDispatch();
  const { destinations, loadDestination } = useSelector((s) => s.destinationReducer);
  const { voyages, loadVoyage } = useSelector((s) => s.voyageReducer);

  useEffect(() => {
    dispatch(getAllDestinations());
    dispatch(getAllVoyages());
  }, [dispatch]);

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4 fw-bold">🛠️ Dashboard Admin</h2>

      <AdminStats destinations={destinations} voyages={voyages} />

      <Tabs defaultActiveKey="destinations" className="mb-4">
        <Tab eventKey="destinations" title="🌍 Destinations">
          <DestinationTab destinations={destinations} loadDestination={loadDestination} />
        </Tab>
        <Tab eventKey="voyages" title="✈️ Voyages">
          <VoyageTab voyages={voyages} destinations={destinations} loadVoyage={loadVoyage} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Admin;