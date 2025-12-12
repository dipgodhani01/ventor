import { useEffect, useState } from "react";
import { ErrorMessage } from "../../Constant/ErrorMessage";
import { addCategories } from "../../data/MapingData";
import FormFields from "../common/FormFields";
import Button from "../UI/Button";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { uploadImage } from "../../utils/uploadImage";
import ImagePreview from "../common/ImagePreview";
import { validateSchema } from "../../helper/validateForm";

function AddCategories() {
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({ categoryImg: null, categoryName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const onChangeField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "categoryImg" && value instanceof File) {
      setImagePreview(URL.createObjectURL(value));
    }

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
      let imageUrl = form.categoryImg;

      if (form.categoryImg instanceof File) {
        imageUrl = await uploadImage(
          "ventor-image",
          "category",
          form.categoryImg
        );

        if (!imageUrl) {
          toast.error("Image upload failed");
          return;
        }
      }
      let response;

      // CREATE
      if (!id) {
        response = await api.post(
          `/category/create`,
          {
            categoryName: form.categoryName,
            categoryImg: imageUrl,
          },
          { withCredentials: true }
        );
      }

      // UPDATE
      if (id) {
        response = await api.put(
          `/category/update`,
          {
            id,
            categoryName: form.categoryName,
            categoryImg: imageUrl,
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
        const { data } = await api.get(`/category/${id}`);

        if (data.status) {
          setForm({
            categoryImg: data.data.categoryImg,
            categoryName: data.data.categoryName,
          });

          setImagePreview(data.data.categoryImg);
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
          {imagePreview && <ImagePreview prev={imagePreview} />}
          {addCategories({ ...form, error, onChangeField }).map((item) => (
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
          ))}

          <div>
            <Button
              type="submit"
              text={!loading && id ? "Update" : "Add Category"}
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

export default AddCategories;
