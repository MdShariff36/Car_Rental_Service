import { API_BASE } from "../base/config.js";
import { getToken } from "../base/storage.js";

export const api = async (
  path,
  method = "GET",
  body = null,
  includeAuth = true,
) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const token = getToken();
  if (includeAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    mode: "cors",
    credentials: "omit", // ✅ IMPORTANT: Don't send credentials
  };

  if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    config.body = JSON.stringify(body);
  }

  try {
    console.log(`🔵 API Call: ${method} ${API_BASE}${path}`);

    const response = await fetch(`${API_BASE}${path}`, config);

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.message || data || `HTTP ${response.status}`;
      console.error(`❌ API Error:`, errorMessage);
      throw new Error(errorMessage);
    }

    console.log("✅ API Response:", data);
    return data;
  } catch (error) {
    console.error("❌ API call failed:", error);
    throw error;
  }
};
