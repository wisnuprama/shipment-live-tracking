import React from "react";
import styled from "styled-components";

import * as io from "../../modules/socket";

const geoOptions = {
  enableHighAccuracy: true
};

const defaultLatestCoord = shippingCode => ({
  shippingCode,
  lat: null,
  lng: null
});

export default function CoordTracker({ shippingCode }) {
  const [watchId, setWatchId] = React.useState(null);
  const [isOnline, setIsOnline] = React.useState(() => io.socket.connected);
  const [latestCoord, setLatestCoord] = React.useState(
    defaultLatestCoord(shippingCode)
  );

  React.useEffect(() => {
    function handlePositionChange({ coords }) {
      const { latitude: lat, longitude: lng } = coords;
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
      setWatchId(id);
    }

    // update socket status
    setIsOnline(io.socket.connected);
    return () => {
      if (watchId !== null) {
        // clean up
        navigator.geolocation.clearWatch(watchId);
        io.leaveRoom(shippingCode);
      }
    };
  }, [
    watchId,
    shippingCode,
    setWatchId,
    setIsOnline,
    latestCoord,
    setLatestCoord
  ]);
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
