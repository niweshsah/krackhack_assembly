import { createReducer } from "@reduxjs/toolkit";
const initialState = {
    isAuthenticated : false
};
// userReducer
export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('LoginRequest', (state) => {
      state.loading = true;
    })
    .addCase('LoginSuccess', (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase('LoginFailure', (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase('RegisterRequest', (state) => {
      state.loading = true;
    })
    .addCase('RegisterSuccess', (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase('RegisterFailure', (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })

    .addCase('LoadUserRequest', (state) => {
      state.loading = true;
    })
    .addCase('LoadUserSuccess', (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase('LoadUserFailure', (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase('LogoutUserRequest', (state) => {
      state.loading = true;
    })
    .addCase('LogoutUserSuccess', (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase('LogoutUserFailure', (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = true;
    })
    .addCase('clearErrors', (state) => {
      state.error = null;
    });
});
// allUsersReducer
export const allUsersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('allUsersRequest', (state) => {
      state.loading = true;
    })
    .addCase('allUsersSuccess', (state, action) => {
      state.loading = false;
      state.users = action.payload;
    })
    .addCase('allUsersFailure', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('clearErrors', (state) => {
      state.error = null;
    });
});

// userProfileReducer
// export const userProfileReducer = createReducer(initialState, (builder) => {
//   builder
//     .addCase('userProfileRequest', (state) => {
//       state.loading = true;
//     })
//     .addCase('userProfileSuccess', (state, action) => {
//       state.loading = false;
//       state.user = action.payload;
//     })
//     .addCase('userProfileFailure', (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     })
//     .addCase('clearErrors', (state) => {
//       state.error = null;
//     });
// });
