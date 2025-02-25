import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import store from "./store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" key="ecomm-ui-theme">
        <Toaster position="top-right" reverseOrder={false} />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
