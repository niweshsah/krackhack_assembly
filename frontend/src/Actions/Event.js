import axios from "axios";
import { API_BASE_URL } from "../config";

export const getEvents =
    (name = "") =>
        async (dispatch) => {
            try {
                dispatch({
                    type: "allEventsRequest",
                });
                const { data } = await axios.get(`${API_BASE_URL}/events`);
                dispatch({
                    type: "allEventsSuccess",
                    payload: data.events,
                });
            } catch (error) {
                dispatch({
                    type: "allEventsFailure",
                    payload: error.response.data.message,
                });
            }
        };
export const commentEvent = (event_id, comment) => async (dispatch) => {
    try {
        dispatch({
            type: "commentRequest",
        });
        const { data } = await axios.post(
            "/api/v1/event/review",
            { event_id, comment },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        dispatch({
            type: "commentSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "commentFailure",
            payload: error.response.data.message,
        });
    }
};
export const bookTicket = (event_id, category) => async (dispatch) => {
    try {
        dispatch({
            type: "bookRequest",
        });
        // const { data } = await axios.get(`/api/v1/post/${id}`);
        const { data } = await axios.post(
            "/api/v1/event/book_ticket",
            { event_id, category },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        dispatch({
            type: "bookSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "bookFailure",
            payload: error.response.data.message,
        });
    }
};

export const createNewEvent = (image, title, date, time, venue, organiser, tickets) => async (dispatch) => {
    try {
        dispatch({
            type: "newEventRequest",
        });
        
        console.log(title);
        console.log("--------------------------------------------------------");
        // const { data } = await axios.get(`/api/v1/post/${id}`);
        const { data } = await axios.post(
            `${API_BASE_URL}/event/create`,
            { image, title, date, time, venue, organiser,tickets},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        dispatch({
            type: "newEventSuccess",
            payload: {
                message: data.message,    // Returned message
                // messageId: data.messageId // Assuming API returns messageId
            },
        });
    } catch (error) {
        dispatch({
            type: "newEventFailure",
            payload: error.response.data.message,
        });
    }
};
// export const finish_debate = (debateId) => async (dispatch) => {
//     try {
//         dispatch({
//             type: "finishDebateRequest",
//         });
//         // const { data } = await axios.get(`/api/v1/post/${id}`);
//         const { data } = await axios.post(
//             "/api/v1/debate/finish",
//             {debateId},
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//         dispatch({
//             type: "finishDebateSuccess",
//             payload: {
//                 message: data.message,    // Returned message
//                 // messageId: data.messageId // Assuming API returns messageId
//             },
//         });
//     } catch (error) {
//         dispatch({
//             type: "finishDebateFailure",
//             payload: error.response.data.message,
//         });
//     }
// };