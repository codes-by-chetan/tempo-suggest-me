const dev = {
  API_URL: "https://suggest-me.onrender.com/api/",
  SOCKET_URL: "https://suggest-me.onrender.com",
};

const prod = {
  API_URL: "https://suggest-me.onrender.com/api/",
  SOCKET_URL: "https://suggest-me.onrender.com",
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default config;
