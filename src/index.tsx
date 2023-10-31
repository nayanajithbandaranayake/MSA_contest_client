import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/index.css";

import io, { Socket } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL!);

const socketContext = React.createContext<Socket | null>(null);

export const useSocketContext = () => useContext(socketContext);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <socketContext.Provider value={socket}>
      <App />
    </socketContext.Provider>
  </React.StrictMode>
);
