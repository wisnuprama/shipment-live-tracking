import React from "react";
import styled from "styled-components";

import * as io from "../../modules/socket";

const geoOptions = {
  enableHighAccuracy: false,
  timeout: 250,
  maximumAge: 0,
  distanceFilter: 5
};

const defaultLatestCoord = shippingCode => ({
  shippingCode,
  lat: null,
  lng: null
});

/**
 * Track the coordinate of the user and send to server
 */
export default function CoordTracker({
  shippingCode,
  destinationLat,
  destinationLng,
  onArrived
}) {
  const [watchId, setWatchId] = React.useState(null);
  const [isOnline, setIsOnline] = React.useState(() => io.socket.connected);
  const [latestCoord, setLatestCoord] = React.useState(
    defaultLatestCoord(shippingCode)
  );

  React.useEffect(() => {
    function handlePositionChange({ coords }) {
      const { latitude: lat, longitude: lng } = coords;
      console.log(coords);
      // we only update the latest coordinate
      // when the old coordinate is different from the new one
      if (latestCoord.lat !== lat || latestCoord.lng !== lng) {
        setLatestCoord({ shippingCode, lat, lng });
        io.emitSendCoordinate(shippingCode, lat, lng);
      }
    }

    // check for Geolocation support
    if (!navigator.geolocation) {
      alert("No Geolocation");
    } else if (!watchId && shippingCode) {
      // socker event handler
      io.connect(shippingCode);
      // watch for position change
      const { geolocation } = navigator;
      const id = geolocation.watchPosition(
        handlePositionChange,
        () => alert("Location needed to track the shipment"),
        geoOptions
      );
      // save the watch id so we can
      // use it for clean up
      setWatchId(id);
    }

    // update socket status
    setIsOnline(io.socket.connected);
    return () => {
      if (watchId !== null) {
        // clean up
        navigator.geolocation.clearWatch(watchId);
        io.socket.removeListener(io.events.arrived);
        io.leaveRoom(shippingCode);
      }
    };
  }, [
    watchId,
    shippingCode,
    setWatchId,
    setIsOnline,
    latestCoord,
    setLatestCoord,
    destinationLat,
    destinationLng
  ]);

  React.useEffect(() => {
    if (io.socket.hasListeners(io.events.arrived)) {
      io.socket.removeListener(io.events.arrived);
    }

    io.addArrivedListener(data => {
      // clear the shipment
      onArrived(data);
      // force disconnect because the goods has arrived
      io.socket.disconnect();
    });

    return () => {
      io.socket.removeListener(io.events.arrived);
    };
  }, [onArrived]);

  return (
    <Container
      className="d-flex align-items-center p-2 clearfix"
      online={isOnline}
    >
      <strong>{isOnline ? "Online" : "Offline"}</strong>
      <div className="spinner-grow ml-auto text-light" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: sticky;
  top: 0;
  background: #${props => (props.online ? "1de251" : "f81e07")};
  color: #fff;
  text-align: center;
`;
