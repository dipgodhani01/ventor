import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { LoaderBtn } from "../components/common/Loader";
import Button from "../components/UI/Button";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/slice/authSlice";

function Header() {
  const { authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.from("header", {
      x: -50,
      opacity: 0,
      duration: 2,
      ease: "power3.out",
    });
  });

  const handleLogout = async () => {
    dispatch(logoutUser(navigate));
  };

  return (
    <header>
      <div className="p-2 text-end bg-gray-800">
        <Button
          text={authLoading ? <LoaderBtn className="mx-auto" /> : "Logout"}
          bg="bg-[var(--danger)]"
          className="py-1 w-fit px-4 font-sans"
          action={handleLogout}
        />
      </div>
    </header>
  );
}

export default Header;
