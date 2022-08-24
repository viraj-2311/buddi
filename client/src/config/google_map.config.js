export default {
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
};

export const mapboxConfig = {
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 18,
  defaultZoom: 11,
  center: [40.706877, -74.011265],
};
