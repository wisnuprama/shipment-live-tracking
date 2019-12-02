import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getShipments } from "../../modules/restapi";
import Card from "../../components/Card";

/**
 * Userflow 5
 */
function ShipmentListPage() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getShipments();
      setData(response.data);
    }
    fetchData();
  }, [setData]);

  let shipments = data;
  if (keyword) {
    shipments = shipments.filter(s => s.shippingCode.includes(keyword));
  }

  return (
    <Container className="container">
      <Header>
        <h3>All Shipments</h3>
        <input
          className="form-control"
          placeholder="Search shipping code..."
          onChange={e => setKeyword(e.target.value)}
        />
      </Header>
      {shipments.map(shipment => {
        return (
          <Card
            key={shipment.shippingCode}
            title={`SC${shipment.shippingCode}`}
            description={`status: ${shipment.status} | ${
              shipment.startName
            } -> ${shipment.destinationName} | ${new Date(
              shipment.createdAt
            ).toLocaleString()}`}
            next={`/shipments/${shipment.shippingCode}`}
          />
        );
      })}
    </Container>
  );
}

export default ShipmentListPage;

const Header = styled.div`
  position: sticky;
  top: 0;
  background-color: #ffffff;
  width: 100%;
  z-index: 1;
  margin-bottom: 24px;
`;

const Container = styled.div`
  position: relative;
  top: 0;
  margin: 0 auto;
  padding: 24px 0;
`;
