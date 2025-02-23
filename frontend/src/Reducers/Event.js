import { createReducer } from "@reduxjs/toolkit";

const initialState = {};
export const eventReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("commentRequest", (state) => {
            state.loading = true;
        })
        .addCase("commentSuccess", (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase("commentFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("newEventRequest", (state) => {
            state.loading = true;
        })
        .addCase("newEventSuccess", (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase("newEventFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("bookRequest", (state) => {
            state.loading = true;
        })
        .addCase("bookSuccess", (state, action) => {
            state.loading = false;
            state.messageId = action.payload;
        })
        .addCase("bookFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase('allEventsRequest', (state) => {
            state.loading = true;
        })
        .addCase('allEventsSuccess', (state, action) => {
            state.loading = false;
            state.events = action.payload;
        })
        .addCase('allEventsFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("clearErrors", (state) => {
            state.error = null;
        })
        .addCase("clearMessage", (state) => {
            state.message = null;
        });
});