import { MdBarChart, MdCategory } from "react-icons/md";
import { formatDate } from "../helper/helper";
import { FaBoxOpen } from "react-icons/fa";

export const sidebarMenuItems = [
  { icon: MdBarChart, label: "Dashboard", path: "/" },
  { icon: MdCategory, label: "Categories", path: "/categories" },
  { icon: FaBoxOpen, label: "Products", path: "/products" },
];

export const addCategories = ({ error, form, onChangeField }) => {
  return [
    {
      id: 1,
      error: error?.categoryImg,
      type: "file",
      name: "categoryImg",
      label: "Category Image",
      value: form?.categoryImg,
      onChange: onChangeField,
    },
    {
      id: 2,
      error: error?.categoryName,
      type: "text",
      name: "categoryName",
      label: "Category Name",
      placeholder: "Write name of category",
      value: form?.categoryName,
      onChange: onChangeField,
    },
  ];
};

export const loginField = ({ error, form, onChangeField }) => {
  return [
    {
      id: 1,
      error: error?.email,
      type: "text",
      name: "email",
      label: "Email",
      placeholder: "Email",
      value: form?.email,
      onChange: onChangeField,
    },
    {
      id: 2,
      error: error?.password,
      type: "password",
      name: "password",
      label: "Password",
      placeholder: "password",
      value: form?.password,
      onChange: onChangeField,
    },
  ];
};

export const addSubCategories = ({
  categories,
  error,
  form,
  onChangeField,
}) => {
  return [
    {
      id: 1,
      error: error?.categoryId,
      type: "select",
      name: "categoryId",
      label: "Category ID",
      value: form?.categoryId,
      onChange: onChangeField,
      options:
        categories?.map((cat) => ({
          id: cat.id,
          label: cat.categoryName,
          value: cat.id,
        })) || [],
    },
    {
      id: 2,
      error: error?.subcategory,
      type: "text",
      name: "subcategory",
      label: "Sub-Category",
      placeholder: "Enter sub-category",
      value: form?.subcategory,
      onChange: onChangeField,
    },
  ];
};

export const categoryColumns = [
  { key: "id", label: "ID", sortable: true },
  {
    key: "categoryName",
    label: "Category",
    render: (value, item) => <span>{item?.categoryName}</span>,
  },
  {
    key: "createdAt",
    label: "Created At",
    sortable: true,
    render: (value) => <span>{formatDate(value)}</span>,
  },
  {
    key: "updatedAt",
    label: "Updated At",
    sortable: true,
    render: (value) => <span>{formatDate(value)}</span>,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value, item) => {
      return (
        <span
          className={`${
            item.status
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }`}
        >
          {item.status ? "Active" : "Inactive"}
        </span>
      );
    },
  },
];

export const subcategoryColumns = [
  { key: "id", label: "ID", sortable: true },
  {
    key: "subcategory",
    label: "Subcategory",
    render: (value, item) => <span>{item?.subcategory}</span>,
  },
  {
    key: "createdAt",
    label: "Created At",
    sortable: true,
    render: (value) => <span>{formatDate(value)}</span>,
  },
  {
    key: "updatedAt",
    label: "Updated At",
    sortable: true,
    render: (value) => <span>{formatDate(value)}</span>,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value, item) => {
      return (
        <span className={`${item.status ? "text-green-400" : "text-red-500"}`}>
          {item.status ? "Active" : "Inactive"}
        </span>
      );
    },
  },
];

export const addProduct = ({ categories, error, form, onChangeField }) => {
  return [
    {
      id: 1,
      error: error?.thumbnail,
      type: "file",
      name: "thumbnail",
      label: "Product Thumbnail",
      value: form?.thumbnail,
      onChange: onChangeField,
      accept: "image/*",
    },
    {
      id: 2,
      error: error?.images,
      type: "file",
      name: "images",
      label: "Product Images",
      value: form?.images,
      onChange: onChangeField,
      multiple: true,
      accept: "image/*",
    },
    {
      id: 3,
      error: error?.productName,
      type: "text",
      name: "productName",
      label: "Product Name",
      value: form?.productName,
      onChange: onChangeField,
    },
    {
      id: 4,
      error: error?.categoryId,
      type: "select",
      name: "categoryId",
      label: "Category ID",
      value: form?.categoryId,
      onChange: onChangeField,
      options:
        categories?.map((cat) => ({
          id: cat.id,
          label: cat.categoryName,
          value: cat.id,
        })) || [],
    },
  ];
};

export const productColumns = [
  { key: "id", label: "ID", sortable: true },
  {
    key: "thumbnail",
    label: "Thumbnail",
    render: (value, item) => (
      <div className="w-12 h-10">
        <img src={item?.thumbnail} alt="T" className="h-full w-full rounded" />
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    sortable: true,
    render: (value) => <span>{formatDate(value)}</span>,
  },
  {
    key: "updatedAt",
    label: "Updated At",
    sortable: true,
    render: (value) => <span>{formatDate(value)}</span>,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value, item) => {
      return (
        <span
          className={`${
            item.status
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }`}
        >
          {item.status ? "Active" : "Inactive"}
        </span>
      );
    },
  },
];
