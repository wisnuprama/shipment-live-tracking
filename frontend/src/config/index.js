export const GOOGLE_MAPS_API_KEY = "AIzaSyBThRAG3ComsOAhNqLNyzegm7ZrLVz9FtU";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const BACKEND_URL = IS_DEVELOPMENT
  ? "http://localhost:5000"
  : "https://pdb.wisnuprama.tech/livetracking";
export const SOCKET_URL = IS_DEVELOPMENT
  ? "http://localhost:5000"
  : "https://pdb.wisnuprama.tech";
