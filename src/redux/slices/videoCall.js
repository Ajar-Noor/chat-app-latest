import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../socket";
import axios from "../../utils/axios";

const initialState = {
  open_video_dialog: false,
  open_video_notification_dialog: false,
  call_queue: [],
  incoming: false,
};

const slice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {
    pushToVideoCallQueue(state, action) {
      if (state.call_queue.length === 0) {
        return {
          ...state,
          call_queue: [action.payload.call],
          open_video_notification_dialog: action.payload.incoming,
          incoming: action.payload.incoming,
          open_video_dialog: !action.payload.incoming,
        };
      } else {
        socket.emit("user_is_busy_video_call", { ...action.payload });
        return state;
      }
    },
    resetVideoCallQueue(state, action) {
      return {
        ...state,
        call_queue: [],
        open_video_notification_dialog: false,
        incoming: false,
      };
    },
    closeNotificationDialog(state, action) {
      return {
        ...state,
        open_video_notification_dialog: false,
      };
    },
    updateCallDialog(state, action) {
      return {
        ...state,
        open_video_dialog: action.payload.state,
        open_video_notification_dialog: false,
      };
    },
  },
});

// Reducer
export default slice.reducer;

// Redux Thunk Actions
export const StartVideoCall = (id) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetVideoCallQueue());
    axios
      .post(
        "/user/start-video-call",
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.pushToVideoCallQueue({
            call: response.data.data,
            incoming: false,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const PushToVideoCallQueue = (call) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.pushToVideoCallQueue({ call, incoming: true }));
  };
};

export const ResetVideoCallQueue = () => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetVideoCallQueue());
  };
};

export const CloseVideoNotificationDialog = () => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.closeNotificationDialog());
  };
};

export const UpdateVideoCallDialog = ({ state }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateCallDialog({ state }));
  };
};
