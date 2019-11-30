import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

export default function Card(props) {
  return (
    <Link
      to={{ pathname: props.next, state: props.next }}>
      <Container>
        {props.title && <Title>{props.title}</Title>}
        {props.description && <Description>{props.description}</Description>}
      </Container>
    </Link>
    );
}

const Container = styled.div`
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  margin: 10px 0;
`;

const Title = styled.h3`
  color: black;
  font-size: 16px;
  :hover {
    text-decoration: none;
  }
`;

const Description = styled.div`
  font-size: 12px;
  color: grey;
`;