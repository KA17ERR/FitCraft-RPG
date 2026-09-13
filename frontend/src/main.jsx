import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { WaterProvider } from "./context/WaterContext";
import { CharacterProvider } from "./context/CharacterContext";
import { ProgressionProvider } from "./context/ProgressionContext";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CharacterProvider>
            <ProgressionProvider>
              <WaterProvider>
                <App />
              </WaterProvider>
            </ProgressionProvider>
          </CharacterProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
