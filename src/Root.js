import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import persistor, { store } from "./Redux/store";
import { PersistGate } from "redux-persist/lib/integration/react";

function Root() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  );
}
export default Root;
