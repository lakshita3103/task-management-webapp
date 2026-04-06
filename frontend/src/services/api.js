import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "taskflow_token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function normalizeError(error) {
  return new Error(error.response?.data?.message || "Request failed.");
}

async function request(config) {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const authApi = {
  register: (payload) =>
    request({
      url: "/auth/register",
      method: "POST",
      data: payload
    }),
  login: (payload) =>
    request({
      url: "/auth/login",
      method: "POST",
      data: payload
    }),
  logout: () =>
    request({
      url: "/auth/logout",
      method: "POST"
    }),
  getCurrentUser: () =>
    request({
      url: "/auth/me",
      method: "GET"
    })
};

export const boardsApi = {
  getBoards: () =>
    request({
      url: "/boards",
      method: "GET"
    }),
  getBoard: (boardId) =>
    request({
      url: `/boards/${boardId}`,
      method: "GET"
    }),
  createBoard: (payload) =>
    request({
      url: "/boards",
      method: "POST",
      data: payload
    }),
  deleteBoard: (boardId) =>
    request({
      url: `/boards/${boardId}`,
      method: "DELETE"
    })
};

export const listsApi = {
  createList: (boardId, payload) =>
    request({
      url: `/boards/${boardId}/lists`,
      method: "POST",
      data: payload
    }),
  deleteList: (boardId, listId) =>
    request({
      url: `/boards/${boardId}/lists/${listId}`,
      method: "DELETE"
    })
};

export const tasksApi = {
  createTask: (listId, payload) =>
    request({
      url: `/lists/${listId}/tasks`,
      method: "POST",
      data: payload
    }),
  toggleTask: (listId, taskId) =>
    request({
      url: `/lists/${listId}/tasks/${taskId}`,
      method: "PATCH"
    }),
  deleteTask: (listId, taskId) =>
    request({
      url: `/lists/${listId}/tasks/${taskId}`,
      method: "DELETE"
    })
};
