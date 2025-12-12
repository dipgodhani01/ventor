import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import RoutesPaths from "./router/index";
import { useSelector } from "react-redux";
import { Loader } from "../components/common/Loader";

const Router = () => {
  const location = useLocation();
  const { admin, adminLoading } = useSelector((state) => state.auth);

  if (adminLoading) return <Loader />;

  const FinalRoute = ({ route }) => {
    if (adminLoading) return <Loader />;

    if (route?.meta?.authRoute && !admin) {
      return (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
      );
    }

    if (admin && route.path === "/login") {
      return <Navigate to="/" replace />;
    }

    return <route.component />;
  };

  return (
    <>
      <Routes>
        {RoutesPaths.map((route, index) => {
          return (
            <Route
              exact
              key={index}
              path={route?.path}
              element={<FinalRoute route={route} />}
            />
          );
        })}
      </Routes>
    </>
  );
};

export default Router;
