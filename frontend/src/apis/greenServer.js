import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    /* "Content-type": "application/json",
    //Accept: "application/json",
    "Access-Control-Allow-Origin": "*", */
  },
});
