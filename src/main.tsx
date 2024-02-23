import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { EngineProvider } from "./AudioContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EngineProvider>
      <App />
    </EngineProvider>
  </React.StrictMode>
);
