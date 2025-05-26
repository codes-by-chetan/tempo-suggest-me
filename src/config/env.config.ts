const dev = {
  API_URL: "http://192.168.0.108:3000/api/",
  SOCKET_URL: "http://192.168.0.108:3000",
};

const prod = {
  API_URL: "https://suggest-me.onrender.com/api/",
  SOCKET_URL: "https://suggest-me.onrender.com",
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default config;
