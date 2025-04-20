import axios from "axios";

const DB_URL = "http://localhost:5004";

 export const axiosInstance = axios.create({
  baseURL: DB_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", 
  },
});

