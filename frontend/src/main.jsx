import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <GoogleOAuthProvider
      clientId="1059938119909-k9efgma79gkhbfdmnr90tsv0ke3290ia.apps.googleusercontent.com"
    >

      <AuthProvider>
        <App />
      </AuthProvider>

    </GoogleOAuthProvider>

  </React.StrictMode>
);