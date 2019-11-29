import io from "socket.io-client";
import * as utils from "./utils";

export function createSocket() {
  return io(`http://${document.domain}:5000`);
}

export const socket = createSocket();

export const events = Object.freeze({
  connect: "connect",
  disconnect: "disconnect",
  join: "join",
  leave: "leave",

  liveTracking: "live tracking",
  sendCoord: "send coordinate"
});

export function connect(shippingCode, onConnect, onDisconnect) {
  socket.on(events.connect, () => {
    socket.emit(events.join, utils.transformRequestData({ shippingCode }));
    onConnect && onConnect();
  });
  if (onDisconnect) {
    socket.on(events.disconnect, onDisconnect);
  }
}

export function leaveRoom(shippingCode) {
  socket.emit(events.leave, utils.transformRequestData({ shippingCode }));
}

export function addLiveTrackingListener(onLiveTracking) {
  socket.on(events.liveTracking, data => {
    onLiveTracking(utils.transformResponseData(data));
  });
}

export function emitSendCoordinate(shippingCode, lat, lng, ...args) {
  socket.emit(
    events.sendCoord,
    utils.transformRequestData({ shippingCode, lat, lng }),
    ...args
  );
}