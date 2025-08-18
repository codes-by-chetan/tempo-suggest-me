const dev = {
  API_URL: "http://192.168.0.39:3200/api/",
  SOCKET_URL: "http://192.168.0.39:3200",
  GOOGLE_CLIENT_ID: "947527639283-36r7dc42qurcpjmc1ro9piuobpea75l0.apps.googleusercontent.com",
  FACEBOOK_APP_ID: "1153044273326246",
  REDIRECT_URI: "http://localhost:5173/auth/callback",
};

const prod = {
  API_URL: "https://suggest-me.onrender.com/api/",
  SOCKET_URL: "https://suggest-me.onrender.com",
  GOOGLE_CLIENT_ID: "947527639283-36r7dc42qurcpjmc1ro9piuobpea75l0.apps.googleusercontent.com",
  FACEBOOK_APP_ID: "1153044273326246",
  REDIRECT_URI: "https://suggest-me-prototype.netlify.app/auth/callback",
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default config;
