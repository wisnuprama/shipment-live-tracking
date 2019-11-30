export const GOOGLE_MAPS_API_KEY = "AIzaSyBThRAG3ComsOAhNqLNyzegm7ZrLVz9FtU";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const BACKEND_URL = IS_DEVELOPMENT
  ? "http://localhost:5000"
  : "http://http://13.76.129.174:5000";
