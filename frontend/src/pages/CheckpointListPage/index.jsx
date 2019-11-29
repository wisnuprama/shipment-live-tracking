import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getCheckpoints } from "../../modules/restapi";
import { Card } from "../../components/Card";

/**
 * Userflow 1
 */

function CheckpointListPage(props) {
  const [data, setData] = useState([]);

  const { shippingCode } = props.match.params;

  async function fetchData() {
    const response = await getCheckpoints(shippingCode);
    setData(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <h3>List of Checkpoints: </h3>
      { data.map((checkpoint) => {
        return (
          <Card 
            key={checkpoint.location_name}
            title={checkpoint.location_name}
            next={`/shipments/${checkpoint.shipping_code}/current-location`} />
        );
      }) }
    </Container>
  );
}

export default CheckpointListPage;

const Container = styled.div`
  position: relative;
  top: 0;
  width: 100%;
  max-width: 425px;
  margin: 0 auto;
  padding: 10px;
`;
