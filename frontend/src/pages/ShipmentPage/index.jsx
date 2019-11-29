import React from "react";
import styled from "styled-components";
import QRCode from "qrcode.react";

import * as RestApi from "../../modules/restapi";

import SelectPlace from "../../components/SelectPlace";
import CoordTracker from "./CoordTracker";

/**
 * Userflow 4
 */
export default function ShipmentPage() {
  const [shipment, setShipment] = React.useState(() => {
    const val = localStorage.getItem("shipment");
    return val ? JSON.parse(val) : null;
  });
  const [formData, setFormData] = React.useState(() => {});

  function handleSubmit(e) {
    e.preventDefault();
    const { start, destination, inventoryCode } = formData;
    const newData = {
      inventoryCode,
      startName: start.locationName,
      startLat: start.lat,
      startLng: start.lng,
      destinationName: destination.locationName,
      destinationLat: destination.lat,
      destinationLng: destination.lng
    };
    RestApi.postShipment(newData)
      .then(res => res.data)
      .then(data => {
        localStorage.setItem("shipment", JSON.stringify(data));
        return setShipment(data);
      });
  }

  const handleChange = React.useCallback(
    ({ target }) => {
      setFormData({ ...formData, [target.name]: target.value });
    },
    [formData]
  );

  const handleSelectPlace = React.useCallback(
    (place, { target }) => {
      setFormData({ ...formData, [target.name]: place });
    },
    [formData]
  );

  const handleClear = React.useCallback(() => {
    localStorage.removeItem("shipment");
    setShipment(null);
    setFormData({});
  }, [setShipment, setFormData]);

  const isShipmentAdded = !!shipment;
  return (
    <>
      {shipment && <CoordTracker shippingCode={shipment.shippingCode} />}
      <QRBacground className="container-fluid">
        <QRWrapper className="d-flex justify-content-center align-items-center">
          {isShipmentAdded ? (
            <QRCode value={shipment.shippingCode} size={window.innerWidth} />
          ) : (
            <h1>QR Code</h1>
          )}
        </QRWrapper>
      </QRBacground>
      <div className="container pt-3 pb-3">
        <h3>PDB Send</h3>
        {isShipmentAdded ? (
          <div className="d-flex flex-column">
            <label htmlFor="shippingCode">
              <strong>Shipping Code</strong>
            </label>
            <p id="shippingCode">{shipment.shippingCode}</p>
            <br />
            <label htmlFor="shippingCode">
              <strong>Start</strong>
            </label>
            <p id="shippingCode">{shipment.startName}</p>
            <br />
            <label htmlFor="shippingCode">
              <strong>Destination</strong>
            </label>
            <p id="shippingCode">{shipment.destinationName}</p>
            <ButtonStickBottom
              type="button"
              className="btn btn-danger btn-block"
              disabled={!isShipmentAdded}
              onClick={handleClear}
            >
              Clear
            </ButtonStickBottom>
          </div>
        ) : (
          <Form
            className="d-flex flex-column mt-3"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="inventoryCode">Inventory code</label>
              <input
                id="inventoryCode"
                name="inventoryCode"
                type="text"
                className="form-control"
                placeholder="Inventory code"
                onChange={handleChange}
                disabled={isShipmentAdded}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="start">Start</label>
              <SelectPlace
                id="start"
                name="start"
                placeholder="Choose starting point..."
                onChange={handleSelectPlace}
                disabled={isShipmentAdded}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <SelectPlace
                id="destination"
                name="destination"
                placeholder="Choose destination..."
                onChange={handleSelectPlace}
                disabled={isShipmentAdded}
                required
              />
            </div>
            <ButtonStickBottom
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isShipmentAdded}
            >
              {isShipmentAdded ? "Tracking..." : "Start"}
            </ButtonStickBottom>
          </Form>
        )}
      </div>
    </>
  );
}

const Form = styled.form`
  height: 400px;
  flex-grow: 1;
`;

const ButtonStickBottom = styled.button`
  margin-top: auto;
`;

const QRBacground = styled.div`
  background: #333;
`;

const QRWrapper = styled.div`
  min-height: 320px;
  * {
    max-width: 360px;
    max-height: 360px;
    object-fit: contain;
  }
`;
