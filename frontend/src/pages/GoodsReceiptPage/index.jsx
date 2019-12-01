import React, { useState, useRef } from "react";
import styled from "styled-components";
import QrReader from "react-qr-scanner";

import SelectPlace from "../../components/SelectPlace";

import * as restapi from "../../modules/restapi";

/**
 * Userflow 3
 */
export default function GoodsReceiptPage() {
  const [shipment, setShipment] = useState(null);
  const [errReaderMsg, setErrReaderMsg] = useState(null);
  const [selectedCheckpoint, selectCheckpoint] = useState(null);
  const qrReaderRef = useRef();

  function handleScan(data) {
    if (data) {
      restapi
        .getShipmentDetail(data)
        .then(res => res.data)
        .then(data => {
          setShipment(data);
          setErrReaderMsg(null);
        })
        .catch(err => setErrReaderMsg(err.message));
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
      .catch(err => setErrReaderMsg(err.message));
  }

  const hasSupportMedia = !!navigator.mediaDevices;
  return (
    <div className="d-flex flex-column">
      {errReaderMsg && <Toast color="#f81e07">{errReaderMsg}</Toast>}
      <QrReader
        ref={qrReaderRef}
        legacyMode={!hasSupportMedia}
        onError={handleError}
        onScan={handleScan}
        style={{
          display: hasSupportMedia ? "block" : "none",
          width: "100%",
          height: 360,
          objectFit: 'fill',
          maxWidth: 400,
          marginLeft: "auto",
          marginRight: "auto"
        }}
      />
      {shipment ||
        (!hasSupportMedia && (
          <QRBg
            className="d-flex"
            onClick={
              hasSupportMedia
                ? handleToggleQr
                : () => qrReaderRef.current.openImageDialog()
            }
          >
            <div style={{ fontSize: 36, color: "#fff", margin: "auto" }}>
              {hasSupportMedia ? "Click to scan" : "Choose photo"}
            </div>
          </QRBg>
        ))}

      <div className="container mt-4">
        <h3>Goods Receipt</h3>
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
          <p id="shippingCode">{shipment ? shipment.shippingCode : "-"}</p>
          <label htmlFor="start">
            <strong>Start</strong>
          </label>
          <p id="start">{shipment ? shipment.startName : "-"}</p>
          <label htmlFor="destination">
            <strong>Destination</strong>
          </label>
          <p id="destination">{shipment ? shipment.destinationName : "-"}</p>
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
  top: 0px;
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
