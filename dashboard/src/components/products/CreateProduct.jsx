import { useEffect, useState } from "react";
import { ErrorMessage } from "../../Constant/ErrorMessage";
import { addProduct } from "../../data/MapingData";
import FormFields from "../common/FormFields";
import Button from "../UI/Button";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { uploadImage } from "../../utils/uploadImage";
import ImagePreview from "../common/ImagePreview";
import { validateSchema } from "../../helper/validateForm";
import { SERVER } from "../../Constant/vriables";
import { useFetch } from "../../hooks/useFetch";
import { IoClose } from "react-icons/io5";

function CreateProduct() {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [form, setForm] = useState({
    thumbnail: null,
    images: [],
    productName: "",
    categoryId: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const { data: category } = useFetch(`${SERVER}/categories`);
  const navigate = useNavigate();
  const { id } = useParams();
  const categories = category?.status ? category.data : [];

  const onChangeField = (field, value) => {
    if (field === "categoryId") {
      value = value ? Number(value) : null;
    }
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "thumbnail" && value instanceof File) {
      setThumbnailPreview(URL.createObjectURL(value));
    }

    if (field === "images" && Array.isArray(value)) {
      const previews = value.map((file) => URL.createObjectURL(file));
      setImagesPreview(previews);
    }

    if (!value || value.length === 0) {
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

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagesPreview((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev?.images?.filter((_, i) => i !== index),
    }));

    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
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
      let thumbnailUrl = form.thumbnail;
      let imagesUrls = [];

      if (form.thumbnail instanceof File) {
        thumbnailUrl = await uploadImage(
          "ventor-image",
          "products",
          form.thumbnail
        );
      }

      if (Array.isArray(form.images) && form.images.length > 0) {
        const uploadPromises = form.images.map((img) => {
          if (img instanceof File) {
            return uploadImage("ventor-image", "products", img);
          }
          return img;
        });
        imagesUrls = await Promise.all(uploadPromises);
      }

      if (!id) {
        const response = await api.post("/product/create", {
          thumbnail: thumbnailUrl,
          images: imagesUrls,
          productName: form.productName,
          categoryId: form.categoryId,
        });

        toast.success(response.data.message);
      } else {
        const response = await api.put("/product/update", {
          id: id,
          thumbnail: thumbnailUrl,
          images: imagesUrls,
          productName: form.productName,
          categoryId: form.categoryId,
        });

        toast.success(response.data.message);
      }
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Server Error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/product/${id}`);

        if (data.status) {
          const product = data.data;
          const images =
            typeof product.images === "string"
              ? JSON.parse(product.images)
              : product.images;

          setForm({
            thumbnail: product.thumbnail,
            images: images || [],
            productName: product.productName,
            categoryId: product.categoryId,
          });

          setThumbnailPreview(product.thumbnail);
          setImagesPreview(images || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="p-4">
      <form
        onSubmit={onFormSubmit}
        className="border border-[var(--border-color)] w-fit p-4 bg-[var(--bg-form)] rounded"
      >
        <div className="flex gap-6 flex-wrap">
          {thumbnailPreview && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Thumbnail Preview:</p>
              <ImagePreview prev={thumbnailPreview} />
            </div>
          )}

          {imagesPreview.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Images Preview:</p>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                {imagesPreview.map((img, i) => (
                  <div key={i} className="relative">
                    <ImagePreview prev={img} />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-fit grid gap-2 md:grid-cols-2">
          {addProduct({ categories, form, error, onChangeField }).map(
            (item) => (
              <FormFields
                key={item.id}
                type={item.type}
                label={item.label}
                placeholder={item.placeholder}
                options={item.options}
                name={item.name}
                value={item.type === "file" ? undefined : form[item.name] || ""}
                onChange={(e) => {
                  if (item.name === "images") {
                    handleImagesChange(e);
                  } else if (item.name === "thumbnail") {
                    onChangeField(item.name, e.target.files[0]);
                  } else {
                    onChangeField(item.name, e.target.value);
                  }
                }}
                multiple={item.name === "images"}
                error={error[item.name]}
              />
            )
          )}
        </div>
        <div>
          <Button
            type="submit"
            text={!loading && id ? "Update" : "Add Product"}
            bg="bg-[var(--warning-dark)]"
            hover="hover:bg-[var(--warning-dark)]"
            loading={loading && loading}
            className="px-4"
          />
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;
