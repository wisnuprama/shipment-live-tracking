import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getShipments } from "../../modules/restapi";
import { Card } from "../../components/Card";

/**
 * Userflow 5
 */

function ShipmentListPage() {
  const [data, setData] = useState([]);

  async function fetchData() {
    const response = await getShipments();
    setData(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <h3>List of Shipments: </h3>
      { data.map((shipment) => {
        return (
          <Card 
            key={shipment.shipping_code}
            title={shipment.shipping_code}
            description={`${shipment.start_name} - ${shipment.destination_name}`}
            next={`/shipments/${shipment.shipping_code}`} />
        );
      }) }
    </Container>
  );
}

export default ShipmentListPage;

const Container = styled.div`
  position: relative;
  top: 0;
  width: 100%;
  max-width: 425px;
  margin: 0 auto;
  padding: 10px;
`;
