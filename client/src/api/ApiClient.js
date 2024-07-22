import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://lemonadswith.store:8080",
});
