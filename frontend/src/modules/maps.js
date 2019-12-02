export function calcDistanceBetween(lat1, lng1, lat2, lng2) {
  // distance between latitudes
  // and longitudes
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLng = ((lng2 - lng1) * Math.PI) / 180.0;

  // convert to radians
  const lat1r = (lat1 * Math.PI) / 180.0;
  const lat2r = (lat2 * Math.PI) / 180.0;

  // apply formulae
  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLng / 2), 2) * Math.cos(lat1r) * Math.cos(lat2r);
  const rad = 6371;
  const c = 2 * Math.asin(Math.sqrt(a));
  return rad * c;
}

export function isInRadius(lat1, lng1, lat2, lng2, radius) {
  return calcDistanceBetween(lat1, lng1, lat2, lng2) <= radius;
}
