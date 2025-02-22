import { configureStore } from "@reduxjs/toolkit";
import { userReducer , allUsersReducer } from "./Reducers/User";
import { eventReducer } from "./Reducers/Event";
const store = configureStore({
    reducer: {
      user: userReducer,
      allUsers: allUsersReducer,
      event : eventReducer
    },
  });
export default store;