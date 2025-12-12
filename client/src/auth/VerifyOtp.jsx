import { useState } from "react";
import Button from "../components/UI/Button";
import { LoaderBtn } from "../components/common/Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { SERVER } from "../Constant/vriables";
import FormFields from "../components/common/FormFields";
import toast from "react-hot-toast";
import { setUser } from "../redux/slice/authSlice";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeField = (value) => {
    setOtp(value);

    if (!value) {
      setError({ otp: "OTP is required" });
    } else {
      setError({ otp: "" });
    }
  };

  const validate = () => {
    if (!otp || otp.trim() === "") {
      setError({ otp: "OTP is required" });
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const email = localStorage.getItem("email");
    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${SERVER}/verify`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(data);

      if (data?.status) {
        dispatch(setUser(data.data));
        toast.success(data.message);
        localStorage.removeItem("email");
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
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
            Verify OTP
          </h2>

          <FormFields
            type="text"
            label="OTP"
            placeholder="Enter your OTP here."
            name="otp"
            value={otp}
            onChange={(e) => onChangeField(e.target.value)}
            error={error.otp}
          />

          <Button
            type="submit"
            text={btnLoading ? <LoaderBtn className="mx-auto" /> : "Verify"}
            bg="bg-[var(--bg-teal)]"
            className="py-1 w-fit px-6"
          />
        </form>
      </div>
    </section>
  );
}

export default VerifyOtp;
