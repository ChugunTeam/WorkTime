import { useCallback, useEffect, useState } from "react";

import { clearToken, decodeJwtPayload, getToken, logout, subscribeTokenChanged } from "./api";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const ROUTES = new Set(["/", "/login", "/register"]);

function getCurrentRoute() {
  return ROUTES.has(window.location.pathname) ? window.location.pathname : "/";
}

function getUserFromToken() {
  const token = getToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload?.sub || !payload?.fio || !payload?.email || !payload?.exp || payload.exp * 1000 <= Date.now()) {
    clearToken();
    return null;
  }

  return {
    id: Number(payload.sub),
    fio: payload.fio,
    email: payload.email
  };
}

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const [user, setUser] = useState(getUserFromToken);

  const navigate = useCallback((nextRoute) => {
    const target = ROUTES.has(nextRoute) ? nextRoute : "/";
    window.history.pushState({}, "", target);
    setRoute(target);
  }, []);

  const syncUserFromToken = useCallback(() => {
    setUser(getUserFromToken());
  }, []);

  useEffect(() => {
    syncUserFromToken();
    return subscribeTokenChanged(syncUserFromToken);
  }, [syncUserFromToken]);

  useEffect(() => {
    const handlePopState = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    navigate("/");
  }

  return (
    <div className="app-layout">
      <Header user={user} onNavigate={navigate} onLogout={handleLogout} />

      {route === "/" && <LandingPage />}
      {route === "/login" && <LoginPage onNavigate={navigate} />}
      {route === "/register" && <RegisterPage onNavigate={navigate} />}
    </div>
  );
}
