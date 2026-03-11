import axios from "axios";
import { getDemoData } from "./demo-data";

const DEMO_MODE = !import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// In demo mode, intercept requests BEFORE they go out and return mock data
if (DEMO_MODE) {
  api.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const params = config.params;
    const data = getDemoData(url, params);
    if (data !== null) {
      console.info(`[demo mode] serving mock data for ${url}`);
      // Cancel the real request and return mock data via adapter
      config.adapter = () =>
        Promise.resolve({ data, status: 200, statusText: "OK (demo)", headers: {}, config });
    }
    return config;
  });
}

// Fallback: catch network errors even when VITE_API_URL is set but backend is down
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isDown = error.code === "ERR_NETWORK" || !error.response || status === 500 || status === 502 || status === 503;
    if (isDown) {
      const url = error.config?.url ?? "";
      const params = error.config?.params;
      const data = getDemoData(url, params);
      if (data !== null) {
        console.info(`[demo mode] serving mock data for ${url}`);
        return { data, status: 200, statusText: "OK (demo)", headers: {}, config: error.config };
      }
    }
    return Promise.reject(error);
  },
);

export default api;
