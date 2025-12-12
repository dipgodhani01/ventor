import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "./layout/Sidebar";
import Router from "./Routers/Router";
import Header from "./layout/Header";
import { Suspense, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { fetchAdmin } from "./redux/slice/authSlice";
import { setTheme } from "./redux/slice/themeSlice";
import { Loader } from "./components/common/Loader";

function AppContent() {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const shouldRenderLayout = ["/login"].includes(pathname);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    dispatch(fetchAdmin());
  }, [dispatch]);

  return (
    <div className={`flex h-screen overflow-hidden`}>
      {!shouldRenderLayout && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden ">
        {!shouldRenderLayout && <Header />}
        <main
          className={`flex-1 overflow-auto bg-[var(--bg-surface)] transition`}
        >
          <Suspense>
            <Router />
          </Suspense>
        </main>
      </div>
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
