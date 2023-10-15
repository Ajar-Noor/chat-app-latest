import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../socket";
import axios from "../../utils/axios";

const initialState = {
  open_audio_dialog: false,
  open_audio_notification_dialog: false,
  call_queue: [],
  incoming: false,
};

const slice = createSlice({
  name: "audioCall",
  initialState,
  reducers: {
    pushToAudioCallQueue(state, action) {
      if (state.call_queue.length === 0) {
        return {
          ...state,
          call_queue: [action.payload.call],
          open_audio_notification_dialog: action.payload.incoming,
          incoming: action.payload.incoming,
          open_audio_dialog: !action.payload.incoming,
        };
      } else {
        // Handle the case when the queue is not empty
        socket.emit("user_is_busy_audio_call", { ...action.payload });
        return state; // No state changes when the queue is not empty
      }
    },
    resetAudioCallQueue(state, action) {
      return {
        ...state,
        call_queue: [],
        open_audio_notification_dialog: false,
        incoming: false,
      };
    },
    closeNotificationDialog(state, action) {
      return {
        ...state,
        open_audio_notification_dialog: false,
      };
    },
    updateCallDialog(state, action) {
      return {
        ...state,
        open_audio_dialog: action.payload.state,
        open_audio_notification_dialog: false,
      };
    },
  },
});

// Reducer
export default slice.reducer;

// Redux Thunk Actions
export const StartAudioCall = (id) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetAudioCallQueue());
    axios
      .post(
        "/user/start-audio-call",
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
          slice.actions.pushToAudioCallQueue({
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

export const PushToAudioCallQueue = (call) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.pushToAudioCallQueue({ call, incoming: true }));
  };
};

export const ResetAudioCallQueue = () => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetAudioCallQueue());
  };
};

export const CloseAudioNotificationDialog = () => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.closeNotificationDialog());
  };
};

export const UpdateAudioCallDialog = ({ state }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateCallDialog({ state }));
  };
};
