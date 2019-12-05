import React from "react";
import styled from "styled-components";

import * as config from "../../config";
import * as io from "../../modules/socket";
import * as mapsUtils from "../../modules/maps";

const GEO_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
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
  const [latestCoord, setLatestCoord] = React.useState(
    defaultLatestCoord(shippingCode)
  );

  const bulkCoords = React.useMemo(() => [], []);

  React.useEffect(() => {
    function handlePositionChange({ coords }) {
      const { latitude: lat, longitude: lng } = coords;
      // we only update the latest coordinate
      // when the old coordinate is different from the new one
      if (
        !latestCoord.lat ||
        !latestCoord.lng ||
        !mapsUtils.isInRadius(latestCoord.lat, latestCoord.lng, lat, lng, 0.005)
      ) {
        const data = { shippingCode, lat, lng };
        bulkCoords.push(data);
        setLatestCoord(data);
      }

      if (config.IS_DEVELOPMENT) {
        console.log(bulkCoords);
      }

      // send every 5 new coordinates
      // to ease frontend processing many coordinates
      if (bulkCoords.length === 5) {
        io.emitSendBulkCoordinate([...bulkCoords]);
        // clear array
        bulkCoords.length = 0;
      }
    }

    let interval;
    // check for Geolocation support
    if (!navigator.geolocation) {
      alert("No Geolocation");
    } else if (shippingCode) {
      // socker event handler
      io.connect(shippingCode);
      // the watch position is not work as expected
      // the event handler isnt getting called, when the position change
      // instead, we check every N milliseconds and check
      // if the position move, then we emit the new change
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          handlePositionChange,
          () => alert("Location needed to track the shipment"),
          GEO_OPTIONS
        );
      }, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      io.socket.removeListener(io.events.arrived);
      io.leaveRoom(shippingCode);
    };
  }, [
    shippingCode,
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
      online={io.socket.connected}
    >
      <strong>{io.socket.connected ? "Online" : "Offline"}</strong>
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
