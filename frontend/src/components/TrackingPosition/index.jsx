import React from "react";

const geoOptions = {
  enableHighAccuracy: true
};

export default function Tracking({ onPositionChange }) {
  const [watchId, setWatchId] = React.useState(null);
  React.useEffect(() => {
    // check for Geolocation support
    if (!navigator.geolocation) {
      alert("No Geolocation");
    } else if (!watchId) {
      const { geolocation } = navigator;
      const id = geolocation.watchPosition(
        onPositionChange,
        () => alert("Location needed to track the shipment"),
        geoOptions
      );
      setWatchId(id);
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [watchId, onPositionChange, setWatchId]);
  return null;
}
