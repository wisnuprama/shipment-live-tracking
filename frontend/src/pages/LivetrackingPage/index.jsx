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
    // return the latest location
    return locations[locations.length - 1];
  }

  useEffect(() => {
    if (!shipment) {
      // load the shipment detail
      restapi
        .getShipmentDetail(shippingCode)
        .then(res => res.data)
        .then(setShipment);
    }

    if (locations.length === 0) {
      // load the all shipment locations
      // for the coord history
      restapi
        .getShipmentLocations(shippingCode)
        .then(res => res.data)
        .then(setLocations);
    }
  }, [shippingCode, shipment, locations, setLocations, setShipment]);

  useEffect(() => {
    // check if there is a listener for the event
    if (!io.socket.hasListeners(io.events.liveTracking)) {
      // if not connect to the socket
      io.connect(shippingCode);
      // and then add the listener
      io.addLiveTrackingListener(newLocation => {
        // update the latest location
        const newLocations = [...locations, newLocation];
        setLocations(newLocations);
      });
    }

    // update socket status
    setIsOnline(io.socket.connected);

    return () => {
      // clean up by leave the room
      io.socket.removeListener(io.events.liveTracking);
      io.leaveRoom(shippingCode);
    };
  }, [locations, setLocations, shippingCode]);

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

      {/* show online / offline */}
      <Toast online={isOnline}>{isOnline ? "Online" : "Offline"}</Toast>

      {/* show google maps only when the latestLoc and shipment have loaded
          else show spinner */}
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
              <Marker key={loc.createdAt} {...loc} color="blue" size={5} />
            ))}
            <Marker {...latestLoc} color="green" size={8} />
            <Marker
              color="red"
              size={10}
              lat={shipment.startLat}
              lng={shipment.startLng}
            />
            <Marker
              color="red"
              size={10}
              lat={shipment.destinationLat}
              lng={shipment.destinationLng}
            />
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
  top: 56px;
  z-index: 10;
  width: 100%;
  color: white;
  text-align: center;
  font-weight: bold;
  background: #${props => (props.online ? "1de251" : "f81e07")};
`;
