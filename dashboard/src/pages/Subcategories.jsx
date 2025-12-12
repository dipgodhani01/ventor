import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { SERVER } from "../Constant/vriables";
import { Loader } from "../components/common/Loader";
import { subcategoryColumns } from "../data/MapingData";
import DataTable from "../components/common/DataTable";
import api from "../utils/api";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

function Subcategories() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const {
    data: subcategory,
    loading,
    refetch,
  } = useFetch(`${SERVER}/subcategory/all/${categoryId}`);
  const subcategories = subcategory?.status ? subcategory.data : [];

  const handleDelete = async (item) => {
    try {
      const res = await api.delete(`/subcategory/delete/${item.id}`);
      if (res.data.status) {
        toast.success(res.data.message);
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleUpdate = (item) => {
    navigate(`/edit-subcategory/${item.id}`);
  };

  const handleStatusChange = async (item) => {
    try {
      const res = await api.put(`/subcategory/status/${item.id}`);
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
      label: "Update Category",
      onClick: handleUpdate,
      icon: <FaEdit size={14} />,
      bg: "bg-[var(--accent-dark)]",
      hoverBg: "hover:bg-[var(--hover-accent)]",
    },
    {
      label: "Delete Category",
      onClick: handleDelete,
      icon: <FaTrash size={12} />,
      bg: "bg-[var(--danger)]",
      hoverBg: "hover:bg-[var(--hover-danger)]",
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
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="w-full pt-4 text-right flex gap-2 flex-wrap items-center justify-end">
              <Link
                to="/categories"
                className="py-2 text-sm font-base rounded px-4 bg-[var(--accent-dark)] hover:bg-[var(--hover-accent)] transition text-[var(--text-inverse)]"
              >
                Back
              </Link>
            </div>

            {!subcategories.length > 0 ? (
              <div className="p-4 mt-4 rounded bg-[var(--bg-teal-light)] w-full text-[var(--warning-dark)] text-xl font-medium text-center">
                Sub-Categories Not Found!
              </div>
            ) : (
              <div className="mt-4">
                <DataTable
                  columns={subcategoryColumns}
                  data={subcategories}
                  tableTitle="Sub-Categories"
                  actions={actions}
                  searchable={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Subcategories;
