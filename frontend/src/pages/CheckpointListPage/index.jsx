import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getCheckpoints } from "../../modules/restapi";
import Card from "../../components/Card";

/**
 * Userflow 1
 */

export default function CheckpointListPage(props) {
  const [data, setData] = useState([]);

  const { shippingCode } = props.match.params;

  useEffect(() => {
    async function fetchData() {
      const response = await getCheckpoints(shippingCode);
      setData(response.data);
    }
    fetchData();
  }, [shippingCode, setData]);

  return (
    <Container>
      <Title>Checkpoints</Title>
      <Card
        title="Check current position"
        next={`/shipments/${shippingCode}/current-location`}
      />
      <hr />
      {data.map((checkpoint, index) => {
        return (
          <Card
            key={checkpoint.locationName}
            title={`${index + 1} | ${checkpoint.locationName}`}
            next={`/shipments/${checkpoint.shippingCode}/current-location`}
          />
        );
      })}
    </Container>
  );
}

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
