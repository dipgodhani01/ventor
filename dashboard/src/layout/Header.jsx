import { useDispatch, useSelector } from "react-redux";
import { MdMenu, MdLightMode, MdDarkMode } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../redux/slice/authSlice";
import { toggleSidebar } from "../redux/slice/layoutSlice";
import { toggleTheme } from "../redux/slice/themeSlice";
import adminLogo from "../assets/images/admin_md.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.admin);
  const theme = useSelector((state) => state.theme.mode);

  const handleLogout = async () => {
    dispatch(logoutAdmin(navigate));
  };

  return (
    <header className="py-2.5 md:px-4 px-2 bg-[var(--bg-surface)] text-[var(--text-main)] border-b border-[var(--border-color)] flex items-center justify-between sticky top-0 z-30 transition">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg lg:hidden"
        >
          <MdMenu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`flex items-center gap-3 pl-2`}>
            <div
              onClick={() => setOpen(!open)}
              className="p-1 w-9 h-9 rounded flex items-center justify-center font-medium text-xl capitalize cursor-pointer border-l border-[var(--border-color)] bg-[var(--bg-card)]"
            >
              <img src={adminLogo} alt="admin" />
            </div>
            <div
              className={`absolute -right-4 top-[45px] w-44 glass shadow rounded transform transition-all duration-300 origin-top-right p-2 ${
                open
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              <div className="pb-4 mx-auto bg-[var(--bg-card)] w-full rounded-md border-l-2 border-r-2 border-[var(--border-color)]">
                <img src={adminLogo} alt="admin" className="mx-auto" />
                <div>
                  <p className="capitalize tracking-wide font-medium text-center">
                    {admin?.username}
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span>Theme</span>
                  <button
                    onClick={() => dispatch(toggleTheme())}
                    className="relative flex items-center w-8 h-5 rounded-xl p-1 transition-all duration-300 focus:outline-none bg-emerald-400 "
                  >
                    <div
                      className={`absolute flex items-center justify-center rounded-full shadow-md transition ${
                        theme === "dark"
                          ? "translate-x-2  text-gray-900"
                          : "translate-x-0 text-white"
                      }`}
                    >
                      {theme === "dark" ? (
                        <MdLightMode size={16} />
                      ) : (
                        <MdDarkMode size={16} />
                      )}
                    </div>
                  </button>
                </div>
                <button
                  className="px-2 py-1.5 w-full rounded bg-[var(--danger-light)] text-red-500 text-sm font-medium mt-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
