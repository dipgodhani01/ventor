import { useEffect, useState } from "react";
import { SERVER } from "../../Constant/vriables";
import { addSubCategories } from "../../data/MapingData";
import { useFetch } from "../../hooks/useFetch";
import { ErrorMessage } from "../../Constant/ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../UI/Button";
import FormFields from "../common/FormFields";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { validateSchema } from "../../helper/validateForm";

function AddSubCategories() {
  const [form, setForm] = useState({ categoryId: null, subcategory: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { data: category } = useFetch(`${SERVER}/category/all`);
  const categories = category?.status ? category.data : [];
  const { id } = useParams();
  const navigate = useNavigate();

  const onChangeField = (field, value) => {
    if (field === "categoryId") {
      value = value ? Number(value) : null;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
    if (value === "" || value === null) {
      const msg =
        ErrorMessage[field]?.message || ErrorMessage[field] || "Required";
      setError((prev) => ({
        ...prev,
        [field]: msg,
      }));
    } else {
      setError((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const errors = validateSchema(ErrorMessage, form);
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      let response;

      // CREATE
      if (!id) {
        response = await api.post(
          `/subcategory/create`,
          {
            categoryId: form.categoryId,
            subcategory: form.subcategory,
          },
          { withCredentials: true }
        );
      }

      // UPDATE
      if (id) {
        response = await api.put(
          `/subcategory/update`,
          {
            id,
            categoryId: form.categoryId,
            subcategory: form.subcategory,
          },
          { withCredentials: true }
        );
      }

      toast.success(response.data.message);
      navigate("/categories");
      return;
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const { data } = await api.get(`/subcategory/${id}`);

        if (data.status) {
          setForm({
            categoryId: data.data.categoryId,
            subcategory: data.data.subcategory,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategory();
  }, [id]);

  return (
    <div className="p-4">
      <form
        onSubmit={onFormSubmit}
        className="border border-[var(--border-color)] w-fit p-4 bg-[var(--bg-form)] rounded"
      >
        <div className="w-fit">
          {addSubCategories({ ...form, categories, error, onChangeField }).map(
            (item) => (
              <FormFields
                key={item.id}
                type={item.type}
                label={item.label}
                placeholder={item.placeholder}
                options={item.options}
                name={item.name}
                value={item.type === "file" ? undefined : form[item.name] || ""}
                onChange={(e) =>
                  onChangeField(
                    item.name,
                    item.type === "file" ? e.target.files[0] : e.target.value
                  )
                }
                error={error[item.name]}
              />
            )
          )}

          <div>
            <Button
              type="submit"
              text={!loading && id ? "Update Sub-category" : "Add Sub-category"}
              bg="bg-[var(--warning-dark)]"
              hover="hover:bg-[var(--warning-dark)]"
              loading={loading && loading}
              className="px-4"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddSubCategories;
