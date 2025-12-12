import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SERVER } from "../Constant/vriables";
import { LoaderBtn } from "../components/common/Loader";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slice/authSlice";
import { loginField } from "../data/MapingData";
import { ErrorMessage } from "../Constant/ErrorMessage";
import FormFields from "../components/common/FormFields";
import { validateSchema } from "../helper/validateForm";
import Button from "../components/UI/Button";

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
      const { data } = await axios.post(`${SERVER}/login`, {
        email: form.email,
        password: form.password,
      });
      if (data?.status) {
        dispatch(setUser(data.data));
        toast.success(data.message);
        localStorage.setItem("email", form.email);
        navigate("/verify-otp");
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
          className="w-full lg:w-2/6 md:w-1/2 bg-[var(--bg-card)] glass rounded-lg p-4 sm:p-8 flex flex-col mt-10 md:mt-0"
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

          <Button
            type="submit"
            text={btnLoading ? <LoaderBtn className="mx-auto" /> : "Login"}
            bg="bg-[var(--bg-teal)]"
            className="py-1 w-fit px-6"
          />

          <p className="mt-2 text-sm">
            Don;t have an account?{" "}
            <Link to={"/register"} className="text-blue-700">
              Register here
            </Link>{" "}
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
