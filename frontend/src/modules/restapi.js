import axios from "axios";

import { transformRequestData, transformResponseData } from "./utils";

export const http = axios.create({
  baseURL: `http://${document.domain}:5000/api`,
  crossDomain: true,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

export async function getShipments(...args) {
  const res = await http.get("/shipments", ...args);
  res.data = res.data.map(s => transformResponseData(s));
  return res;
}

export async function postShipment(data, ...args) {
  const transformedData = transformRequestData(data);
  const res = await http.post("/shipments", transformedData, ...args);
  res.data = transformResponseData(res.data);
  return res;
}

export async function getShipmentDetail(shippingCode, ...args) {
  const res = await http.get(`/shipments/${shippingCode}`, ...args);
  res.data = transformResponseData(res.data);
  return res;
}

export async function getShipmentLocations(shippingCode, ...args) {
  const res = await http.get(`/shipments/${shippingCode}/locations`, ...args);
  res.data = res.data.map(s => transformResponseData(s));
  return res;
}

export async function postShipmentCheckpoint(shippingCode, data, ...args) {
  const transformedData = transformRequestData(data);
  const res = await http.post(`/shipments/${shippingCode}/checkpoints`, transformedData, ...args);
  res.data = transformResponseData(res.data);
  return res;
}

export async function getCheckpoints(shippingCode, ...args) {
  const res = await http.get(`/shipments/${shippingCode}/checkpoints`, ...args);
  res.data = res.data.map(s => transformResponseData(s));
  return res;
}
