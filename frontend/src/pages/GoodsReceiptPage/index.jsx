import React, { useState } from "react";
import styled from "styled-components";
import QrReader from "react-qr-reader";

import SelectPlace from "../../components/SelectPlace";

import * as restapi from "../../modules/restapi";
import * as utils from "../../modules/utils";

/**
 * Userflow 3
 */
export default function GoodsReceiptPage() {
  const [shipment, setShipment] = useState(
    utils.transformResponseData({
      shipping_code: "3eebf26b-6ba2-4511-8bff-8dc6e894e347",
      created_at: "2019-11-29 18:00:01.168000",
      inventory_code: "Test",
      status: "Finished",
      is_finished: true,
      start_name: "Fasilkom Baru",
      start_lat: -6.370562,
      start_lng: 106.827353,
      destination_name: "Home",
      destination_lat: -6.3834941,
      destination_lng: 106.82275899999999,
      checkpoints: []
    })
  );
  const [errReaderMsg, setErrReaderMsg] = useState(null);
  const [selectedCheckpoint, selectCheckpoint] = useState(null);

  function handleScan(data) {
    if (data) {
      restapi
        .getShipmentDetail(data)
        .then(res => res.data)
        .then(data => {
          setShipment(data);
          setErrReaderMsg(null);
        })
        .catch(err => setErrReaderMsg(`${err}`));
    }
  }

  function handleError(err) {
    setErrReaderMsg(`${err}`);
  }

  function handleToggleQr() {
    setShipment(null);
    selectCheckpoint(null);
  }

  function handleSubmitCheckpoint() {
    const { locationName, lat, lng } = selectedCheckpoint;
    const data = {
      locationName,
      locationLat: lat,
      locationLng: lng
    };
    restapi
      .postShipmentCheckpoint(shipment.shippingCode, data)
      .then(() => alert("Saved"))
      .catch(alert);
  }

  return (
    <div className="d-flex flex-column">
      {errReaderMsg && <Toast color="#f81e07">{errReaderMsg}</Toast>}
      {!shipment ? (
        <QrReader
          delay={500}
          onError={handleError}
          onScan={handleScan}
          style={{
            width: "100%",
            maxWidth: 400,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        />
      ) : (
        <QRBg className="d-flex" onClick={handleToggleQr}>
          <div style={{ fontSize: 36, color: "#fff", margin: "auto" }}>
            Click to scan
          </div>
        </QRBg>
      )}
      <div className="container mt-4">
        <h3>PDB Receive</h3>
        <div className="d-flex flex-column">
          <label htmlFor="checkpoint">
            <strong>Choose checkpoint</strong>
          </label>
          <SelectPlace
            id="checkpoint"
            name="checkpoint"
            placeholder="Checkpoint..."
            onChange={selectCheckpoint}
            required
          />
          <br />
          <label htmlFor="shippingCode">
            <strong>Shipping Code</strong>
          </label>
          <p id="shippingCode">{shipment && shipment.shippingCode}</p>
          <label htmlFor="start">
            <strong>Start</strong>
          </label>
          <p id="start">{shipment && shipment.startName}</p>
          <label htmlFor="destination">
            <strong>Destination</strong>
          </label>
          <p id="destination">{shipment && shipment.destinationName}</p>
        </div>
      </div>
      <ButtonWrapper>
        <button
          className="btn btn-primary btn-block"
          disabled={!shipment || !selectedCheckpoint}
          onClick={handleSubmitCheckpoint}
        >
          Received
        </button>
      </ButtonWrapper>
    </div>
  );
}

const Toast = styled.div`
  position: sticky;
  top: 56px;
  z-index: 10;
  width: 100%;
  color: white;
  text-align: center;
  font-weight: bold;
  background: ${props => props.color};
`;

const QRBg = styled.div`
  height: 360px;
  background: #333;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 16px 20px;
  background: #fff;
`;
