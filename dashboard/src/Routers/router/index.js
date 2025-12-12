import { lazy } from "react";

const RoutesPaths = [
  {
    path: "/login",
    component: lazy(() => import("../../pages/Login")),
    meta: {
      authRoute: false,
    },
  },
  {
    path: "/",
    component: lazy(() => import("../../pages/Dashboard")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/categories",
    component: lazy(() => import("../../pages/Categories")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/add-categories",
    component: lazy(() => import("../../components/category/AddCategories")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/edit-category/:id",
    component: lazy(() => import("../../components/category/AddCategories")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/add-subcategories",
    component: lazy(() => import("../../components/category/AddSubCategories")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/subcategories/:categoryId",
    component: lazy(() => import("../../pages/Subcategories")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/edit-subcategory/:id",
    component: lazy(() => import("../../components/category/AddSubCategories")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/products",
    component: lazy(() => import("../../pages/Products")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/add-product",
    component: lazy(() => import("../../components/products/CreateProduct")),
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/edit-product/:id",
    component: lazy(() => import("../../components/products/CreateProduct")),
    meta: {
      authRoute: true,
    },
  },
];

export default RoutesPaths;
