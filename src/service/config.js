// src/services/apiClient.js or src/utils/apiClient.js

import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "./tokenService"; // Adjust path if tokenService is in a different directory

const apiClient = axios.create({
  baseURL: "http://172.17.118.26:8000/api", // Your Laravel API base URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

// Helper to process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token)
  );
  failedQueue = [];
};

// Request Interceptor: Add Authorization header if token exists
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 errors (invalid credentials vs. expired token)
apiClient.interceptors.response.use(
  (response) => response.data, // Return only the data part of the response
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 (Unauthorized)
    if (error.response?.status === 401) {
      // **Scenario 1: Invalid Credentials (from your Laravel Login API)**
      // Your backend returns { "error": "Invalid credentials" } for failed login.
      const backendErrorMessage = error.response.data?.error;

      if (backendErrorMessage === "Invalid credentials") {
        // This is an invalid login attempt, not an expired token.
        // Do NOT try to refresh or redirect. Just reject the promise
        // so the component (e.g., LoginPage) can display the message.
        return Promise.reject(error);
      }

      // **Scenario 2: Token Expired / Unauthorized (requiring refresh)**
      // Ensure we only try to refresh once for a given original request
      if (!originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried

        // If a token refresh is already in progress, queue the current request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            // After refresh, update the original request's header with the new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest); // Re-run the original request
          });
        }

        isRefreshing = true; // Set flag to indicate refresh is starting
        try {
          // Attempt to get a new access token using the refresh token
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            // No refresh token, clear existing tokens and force login
            clearTokens();
            // window.location.href = "/login";
            return Promise.reject(error);
          }

          const res = await axios.post(
            "http://172.17.118.26:8000/api/auth/refresh",
            {
              refresh_token: refreshToken,
            }
          );

          // Store the new tokens
          setAccessToken(res.data.access_token);
          setRefreshToken(res.data.refresh_token);

          // Process all requests that were queued while refreshing
          processQueue(null, res.data.access_token);

          // Update the original request with the new access token and retry it
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return apiClient(originalRequest);
        } catch (err) {
          // If refresh token fails (e.g., invalid, expired refresh token)
          processQueue(err, null); // Reject all queued requests
          clearTokens(); // Clear all tokens
          window.location.href = "/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false; // Reset refresh flag
        }
      }
    }

    // For any other error status (e.g., 400, 403, 404, 500, or a 401 that wasn't handled above),
    // simply reject the promise, allowing the calling component to handle it.
    return Promise.reject(error);
  }
);

export default apiClient;
