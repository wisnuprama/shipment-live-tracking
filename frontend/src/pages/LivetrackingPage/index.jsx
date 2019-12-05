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

  function getLatestLocation() {
    // return the latest location
    return locations[locations.length - 1];
  }

  useEffect(() => {
    if (!shipment && locations.length === 0) {
      // load the shipment detail
      restapi
        .getShipmentDetail(shippingCode)
        .then(res => res.data)
        .then(setShipment);
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
    io.connect(shippingCode);
    // update socket status
    return () => {
      io.leaveRoom(shippingCode);
      io.socket.disconnect();
    };
  }, [shippingCode]);

  useEffect(() => {
    // check if there is a listener for the event
    const listener = newLocations => {
      // update the latest location
      if (config.IS_DEVELOPMENT) {
        console.log("Receive new locations", newLocations);
      }
      setLocations([...locations, ...newLocations]);
      console.log("Updated")
    };
    io.addLiveTrackingListener(listener);
    return () => {
      // clean up by leave the room
      io.socket.removeListener(io.events.liveTracking, listener);
    };
  }, [locations, setLocations]);

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
      <Toast online={io.socket.connected}>
        {io.socket.connected ? "Online" : "Offline"}
      </Toast>

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
            defaultZoom={18}
          >
            {locations.map(
              loc =>
                loc.lat &&
                loc.lng && (
                  <Marker key={loc.createdAt} {...loc} color="blue" size={5} />
                )
            )}
            <Marker {...latestLoc} color="lightgreen" size={5} />
            <StartDestMarker
              color="red"
              size={5}
              lat={shipment.startLat}
              lng={shipment.startLng}
            />
            <StartDestMarker
              color="red"
              size={5}
              lat={shipment.destinationLat}
              lng={shipment.destinationLng}
            />
            {shipment.checkpoints.map(cp => (
              <CheckpointMarker
                key={cp.createdAt}
                color="black"
                size={5}
                lat={cp.locationLat}
                lng={cp.locationLng}
              />
            ))}
          </GoogleMapReact>
        ) : (
          <div className="spinner-grow m-auto text-dark" role="status">
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
  border-radius: 100%;
  transform: translate(-50%, -50%);
`;

const StartDestMarker = styled.div`
  background: ${props => props.color};
  padding: ${props => `${props.size * 1.5}px ${props.size}px`};
  display: inline-flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-color: white;
  border-width: 2px;
  border-style: solid;
  transform: translate(-50%, -50%);
`;

const CheckpointMarker = styled.div`
  background: ${props => props.color};
  padding: ${props => `${props.size}px`};
  display: inline-flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-color: white;
  border-width: 2px;
  border-style: solid;
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
