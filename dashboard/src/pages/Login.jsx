import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SERVER } from "../Constant/vriables";
import { LoaderBtn } from "../components/common/Loader";
import { useDispatch } from "react-redux";
import { setAdmin } from "../redux/slice/authSlice";
import { loginField } from "../data/MapingData";
import { ErrorMessage } from "../Constant/ErrorMessage";
import FormFields from "../components/common/FormFields";
import { validateSchema } from "../helper/validateForm";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeField = (field, value) => {
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${SERVER}/admin/login`,
        {
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );
      if (data?.status) {
        dispatch(setAdmin(data.data));
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <section className="text-gray-400 bg-[var(--bg-body)] body-font h-screen">
      <div className="container px-5 py-24 mx-auto flex items-center justify-center h-full w-full text-[var(--text-main)]">
        <form
          onSubmit={submitHandler}
          className="w-full lg:w-2/6 md:w-1/2 bg-[var(--bg-card)] glass rounded-lg p-8 flex flex-col mt-10 md:mt-0"
        >
          <h2 className="text-xl md:text-2xl font-medium title-font mb-5">
            Welcome Back - Sign In
          </h2>

          {loginField({ ...form, error, onChangeField }).map((item) => (
            <FormFields
              key={item.id}
              type={item.type}
              label={item.label}
              placeholder={item.placeholder}
              options={item.options}
              name={item.name}
              value={form[item.name] || ""}
              onChange={(e) => onChangeField(item.name, e.target.value)}
              error={error[item.name]}
            />
          ))}

          <button
            type="submit"
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            disabled={btnLoading}
          >
            {btnLoading ? <LoaderBtn className="mx-auto" /> : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
