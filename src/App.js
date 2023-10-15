// routes
// theme
// components
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ThemeSettings from "./components/settings";
import ThemeProvider from "./theme";
import Router from "./routes";
import { closeSnackBar } from "./redux/slices/app";
import { socket } from "./socket";
import {Provider as ReduxProvider} from 'react-redux'
import { store } from "./redux/store";

const vertical = "bottom";
const horizontal = "center";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function App() {
  const dispatch = useDispatch();

  const { severity, message, open } = useSelector(
    (state) => state.app.snackbar
  );

  return (
    <>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <ThemeSettings>
          {" "}
          <Router />{" "}
        </ThemeSettings>
      </ThemeProvider>
      </ReduxProvider>

      {message && open ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={4000}
          key={vertical + horizontal}
          onClose={() => {
            console.log("This is clicked");
            dispatch(closeSnackBar());
          }}
        >
          <Alert
            onClose={() => {
              console.log("This is clicked");
              dispatch(closeSnackBar());
            }}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
