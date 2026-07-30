import api from "../../api/axios";

export const registerUser = (data) => {
  return api.post("/users/register", data);
};

export const loginUser = (data) => {
  return api.post("/users/login", data);
};

export const logoutUser = () => {
  return api.post("/users/logout");
};

export const getProfile = () => {
  return api.get("/users/profile");
};

export const updateProfile = (data) => {
  return api.put("/users/profile", data);
};

export const changePassword = (data) => {
  return api.put("/users/change-password", data);
};