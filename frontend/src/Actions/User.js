import axios from "axios";
import Cookies from "js-cookie";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:5000/api/v1/login", { email, password });

    if (response.data?.token) {
      Cookies.set("userToken", response.data.token, { expires: 90, secure: true, sameSite: "Strict" });
      return { success: true, message: "Login successful!" };
    } else {
      return { success: false, message: "Invalid response from server" };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await axios.get("/api/v1/me");
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFailure",
      payload: error.response.data.message,
    });
  }
};
export const getAllUsers =
  (name = "") =>
    async (dispatch) => {
      try {
        dispatch({
          type: "allUsersRequest",
        });

        const { data } = await axios.get("/api/v1/users");
        dispatch({
          type: "allUsersSuccess",
          payload: data.users,
        });
      } catch (error) {
        dispatch({
          type: "allUsersFailure",
          payload: error.response.data.message,
        });
      }
    };
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LogoutRequest",
    });

    const { data } = await axios.get(
      "/api/v1/logout",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: "LogoutSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LogoutFailure",
      payload: error.response.data.message,
    });
  }
};
export const registerUser = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: "RegisterRequest",
    });

    const { data } = await axios.post(
      "http://localhost:5000/api/v1/register",
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: "RegisterSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "RegisterFailure",
      payload: error.response.data.success,
    });
  }
};