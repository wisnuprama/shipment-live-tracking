import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getShipments } from "../../modules/restapi";
import Card from "../../components/Card";

/**
 * Userflow 5
 */

function ShipmentListPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getShipments();
      setData(response.data);
    }
    fetchData();
  }, [setData]);

  return (
    <Container>
      <Title>All Shipments</Title>
      {data.map(shipment => {
        return (
          <Card
            key={shipment.shippingCode}
            title={`SC${shipment.shippingCode}`}
            description={`status: ${shipment.status} | ${shipment.startName} -> ${shipment.destinationName}`}
            next={`/shipments/${shipment.shippingCode}`}
          />
        );
      })}
    </Container>
  );
}

export default ShipmentListPage;

const Title = styled.h3`
  position: sticky;
  top: 0;
`;

const Container = styled.div`
  position: relative;
  top: 0;
  width: 100%;
  max-width: 425px;
  margin: 0 auto;
  padding: 10px;
`;
