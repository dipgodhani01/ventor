import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Router from "./Routers/Router";
import Header from "./layout/Header";
import { Suspense, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import { fetchUser } from "./redux/slice/authSlice";
import Footer from "./layout/Footer";

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const shouldRenderLayout =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp" ||
    pathname.startsWith("/verify-user/");

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div>
      {!shouldRenderLayout && <Header />}
      <main
        className={`overflow-auto bg-[var(--bg-surface)] ${
          !shouldRenderLayout
            ? "md:min-h-[calc(100vh-256px)] min-h-[calc(100vh-308px)]"
            : ""
        }`}
      >
        <Suspense>
          <Router />
        </Suspense>
      </main>
      {!shouldRenderLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 5000,
          }}
        />
      </BrowserRouter>
    </Provider>
  );
}
