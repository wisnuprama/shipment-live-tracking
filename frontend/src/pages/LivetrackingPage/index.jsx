import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import GoogleMapReact from "google-map-react";

import * as config from "../../config";
import * as restapi from "../../modules/restapi";
import * as io from "../../modules/socket";

/**
 * Userflow 2
 */
export default function LiveTrackingPage() {
  const { shippingCode } = useParams();
  const history = useHistory();

  const [shipment, setShipment] = useState(null);
  const [locations, setLocations] = useState(() => []);
  const [isOnline, setIsOnline] = React.useState(() => io.socket.connected);

  function getLatestLocation() {
    return locations[locations.length - 1];
  }

  useEffect(() => {
    function loadLocations() {
      if (!shipment) {
        restapi
          .getShipmentDetail(shippingCode)
          .then(res => res.data)
          .then(setShipment);
      }

      if (locations.length === 0) {
        restapi
          .getShipmentLocations(shippingCode)
          .then(res => res.data)
          .then(setLocations);
      }
    }

    function bindSocket() {
      if (!io.socket.hasListeners(io.events.liveTracking)) {
        io.connect(shippingCode);
        io.addLiveTrackingListener(newLocation => {
          const newLocations = [...locations, newLocation];
          setLocations(newLocations);
        });
      }

      // update socket status
      setIsOnline(io.socket.connected);
    }

    loadLocations();
    bindSocket();

    return () => {
      io.leaveRoom(shippingCode);
    };
  }, [shippingCode, shipment, locations, setLocations, setShipment]);

  const latestLoc = getLatestLocation();

  return (
    <>
      <nav className="navbar sticky-top navbar-light bg-light">
        <div
          className="navbar-brand d-flex flex-row nowrap"
          onClick={history.goBack}
        >
          <div className="mr-3">&times;</div>
          {shipment && `${shipment.startName} -> ${shipment.destinationName}`}
        </div>
      </nav>

      <Toast class="alert alert-success" role="alert" online={isOnline}>
        {isOnline ? "Online" : "Offline"}
      </Toast>

      <div
        className="d-flex"
        style={{ height: "calc(100vh - 56px)", width: "100%" }}
      >
        {latestLoc && shipment ? (
          <GoogleMapReact
            bootstrapURLKeys={{ key: config.GOOGLE_MAPS_API_KEY }}
            defaultCenter={{ lat: latestLoc.lat, lng: latestLoc.lng }}
            defaultZoom={16}
          >
            {locations.map(loc => (
              <Marker key={loc.createdAt} {...loc} color="red" size={4} />
            ))}
            <Marker {...latestLoc} color="blue" size={8} />
          </GoogleMapReact>
        ) : (
          <div className="spinner-grow ml-auto text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </>
  );
}

const Marker = styled.div`
  background: ${props => props.color};
  padding: ${props => `${props.size}px`};
  display: inline-flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-color: white;
  border-width: 2px;
  border-style: solid;
  border-radius: 100%;
  transform: translate(-50%, -50%);
`;

const Toast = styled.div`
  position: sticky;
  top: 24px;
  width: 100%;
  color: white;
  text-align: center;
  font-weight: bold;
  background: #${props => (props.online ? "1de251" : "f81e07")};
`;
