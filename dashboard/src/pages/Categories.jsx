import { useFetch } from "../hooks/useFetch";
import { SERVER } from "../Constant/vriables";
import { Loader } from "../components/common/Loader";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import DataTable from "../components/common/DataTable";
import { FaEdit, FaImage, FaTrash } from "react-icons/fa";
import { categoryColumns } from "../data/MapingData";
import ImagePopup from "../components/common/ImagePopup";
import { useState } from "react";
import { MdCategory } from "react-icons/md";

function Categories() {
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const navigate = useNavigate();
  const {
    data: category,
    loading,
    refetch,
  } = useFetch(`${SERVER}/category/all`);
  const categories = category?.status ? category.data : [];

  const handleDelete = async (item) => {
    try {
      const res = await api.delete(`/category/delete/${item.id}`);
      if (res.data.status) {
        toast.success(res.data.message);
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleUpdate = (item) => {
    navigate(`/edit-category/${item.id}`);
  };
  const viewSubcategories = (item) => {
    navigate(`/subcategories/${item.id}`);
  };

  const viewImage = (item) => {
    setSelectedImg(item.categoryImg);
    setOpen(true);
  };

  const handleStatusChange = async (item) => {
    try {
      const res = await api.put(`/category/status/${item.id}`);
      if (res.data.status) {
        toast.success(res.data.message);
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const actions = [
    {
      label: "View Image",
      onClick: viewImage,
      icon: <FaImage size={14} />,
      bg: "bg-[var(--secondary)]",
      hoverBg: "hover:bg-[var(--hover-secondary)]",
    },
    {
      label: "View Subcategory",
      onClick: viewSubcategories,
      icon: <MdCategory size={14} />,
      bg: "bg-[var(--rose)]",
      hoverBg: "hover:bg-[var(--hover-rose)]",
    },
    {
      label: "Delete Category",
      onClick: handleDelete,
      icon: <FaTrash size={12} />,
      bg: "bg-[var(--danger)]",
      hoverBg: "hover:bg-[var(--hover-danger)]",
    },
    {
      label: "Update Category",
      onClick: handleUpdate,
      icon: <FaEdit size={14} />,
      bg: "bg-[var(--accent-dark)]",
      hoverBg: "hover:bg-[var(--hover-accent)]",
    },
    {
      label: (item) => (item.status ? "Deactivate" : "Activate"),
      onClick: handleStatusChange,
      icon: (item) => (item.status ? "Deactivate" : "Activate"),
      bg: (item) =>
        item.status ? "bg-[var(--danger)]" : "bg-[var(--success-dark)]",
      hoverBg: (item) =>
        item.status
          ? "hover:bg-[var(--hover-danger)]"
          : "hover:bg-[var(--hover-success-dark)]",
    },
  ];

  return (
    <>
      <div className="p-4">
        {loading && <Loader />}

        <div className="w-full pt-4 text-right flex gap-2 flex-wrap items-center justify-end">
          <Link
            to="/add-categories"
            className="py-2 text-sm font-base rounded px-4 bg-[var(--accent-dark)] hover:bg-[var(--hover-accent)] transition text-[var(--text-inverse)]"
          >
            +Add Category
          </Link>
          <Link
            to="/add-subcategories"
            className="py-2 text-sm font-base rounded px-4 bg-[var(--warning-dark)] hover:bg-[var(--hover-warning-dark)] transition text-[var(--text-inverse)]"
          >
            +Add Sub-category
          </Link>
        </div>

        {!categories.length > 0 ? (
          <div className="p-4 mt-4 rounded bg-[var(--bg-teal-light)] w-full text-[var(--warning-dark)] text-xl font-medium text-center">
            Categories Not Found!
          </div>
        ) : (
          <div className="mt-4">
            <DataTable
              columns={categoryColumns}
              data={categories}
              actions={actions}
              tableTitle="Categories"
              searchable
            />
          </div>
        )}
      </div>

      {open && <ImagePopup thumbnail={selectedImg} setOpen={setOpen} />}
    </>
  );
}

export default Categories;
