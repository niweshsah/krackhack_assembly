import axios from "axios";
import Cookies from "js-cookie";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: "LoginRequest",
    });

    const { data } = await axios.post(
      "http://localhost:5000/api/v1/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: "LoginSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoginFailure",
      payload: error.response.data.message,
    });
  }
};
export const loadUser = (email) => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    console.log("Hellooooooooooooooooooo",email)
    // const { data } = await axios.get("http://localhost:5000/api/v1/me");
    const { data } = await axios.post(
      "http://localhost:5000/api/v1/me",
      { email},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("........................................");
    console.log(data);
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
export const registerUser = (name, email, password,walletAddress) => async (dispatch) => {
  try {
    dispatch({
      type: "RegisterRequest",
    });
    const walletId = walletAddress
    const { data } = await axios.post(
      "http://localhost:5000/api/v1/register",
      { name, email, password,walletId},
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