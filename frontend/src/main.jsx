import { createRoot } from "react-dom/client";
import "./app/index.css";
import { Provider } from "react-redux";
import store from "./app/store.js";
import AppRoutes from "./app/routes/AppRoutes.jsx";

import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppRoutes />
    <Toaster position="top-right" richColors />
  </Provider>,
);
