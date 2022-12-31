import axios from "axios";

const baseURLApp = "https://api.imageit.io";
let token;
if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}
const clientApi = axios.create({
  baseURL: baseURLApp,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    accept: "application/json",
    "Accept-Language": "en-US,en;q=0.8",
    Authorization: `Bearer ${token}`,
  },
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});

export const clientApiFile = axios.create({
  baseURL: baseURLApp,
  headers: {
    "content-type": "multipart/form-data",
    accept: "application/json",
    "Accept-Language": "en-US,en;q=0.8",
    responseType: "arraybuffer",
    Authorization: `Bearer ${token}`,
  },

  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});

export default clientApi;
