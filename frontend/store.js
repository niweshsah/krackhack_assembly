import { configureStore } from "@reduxjs/toolkit";
import { userReducer , allUsersReducer } from "./src/Reducers/User";
import { eventReducer } from "./src/Reducers/Event";
const store = configureStore({
    reducer: {
      user: userReducer,
      allUsers: allUsersReducer,
      event : eventReducer
    },
  });
export default store;