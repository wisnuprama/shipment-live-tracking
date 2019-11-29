import axios from "axios";

import { transformRequestData, transformResponseData } from "./utils";

export const http = axios.create({
  baseURL: "http://localhost:5000/api"
});

export function getShipments(...args) {
  return http.get("/shipments", ...args);
}

export function postShipment(data, ...args) {
  const transformedData = transformRequestData(data);
  return http.post("/shipments", transformedData, ...args).then(res => {
    res.data = transformResponseData(res.data);
    return res;
  });
}
