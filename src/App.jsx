import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { useState } from "react";
import * as userService from "services/user";
import { jwtDecode } from "jwt-decode";
import PlantListPage from "pages/PlantListPage";
import PlantShowPage from "./pages/PlantShowPage";

import SessionContext from "./contexts/SessionContext";
import ScrollToTop from "shared-components/Scroll/ScrollToTop";

const App = () => {
  const [sessionToken, setSessionToken] = useState(() =>
    userService.getSessionTokenStorage(),
  );

  return (
    <SessionContext.Provider
      value={{
        username: sessionToken ? jwtDecode(sessionToken).username : null,
        signIn: (token) => {
          setSessionToken(token);
          userService.setSessionTokenStorage(token);
        },
        signOut: () => {
          setSessionToken(null);
          userService.removeSessionTokenStorage();
        },
      }}
    >
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/plants" element={<PlantListPage />} />
          <Route path="/plants/:plantId" element={<PlantShowPage />} />
        </Routes>
      </BrowserRouter>
    </SessionContext.Provider>
  );
};

export default App;
