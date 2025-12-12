import { lazy } from "react";

const RoutesPaths = [
  {
    path: "/login",
    component: lazy(() => import("../../auth/Login")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/register",
    component: lazy(() => import("../../auth/Register")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/verify-user/:token",
    component: lazy(() => import("../../auth/VerifyUser")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/verify-otp",
    component: lazy(() => import("../../auth/VerifyOtp")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/",
    component: lazy(() => import("../../pages/Home")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/home",
    component: lazy(() => import("../../pages/Home")),
    meta: {
      authRoute: true,
    },
  },
];

export default RoutesPaths;
