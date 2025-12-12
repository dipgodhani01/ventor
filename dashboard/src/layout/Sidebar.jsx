import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import adminMd from "../assets/images/admin_md.png";
import { sidebarMenuItems } from "../data/MapingData";
import { closeSidebar, toggleCollapse } from "../redux/slice/layoutSlice";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { isOpen, isCollapsed } = useSelector((state) => state.layout);
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-[var(--bg-surface)] z-40 lg:hidden transition"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-[var(--bg-surface)] text-[var(--text-main)] border-r border-[var(--border-color)] transition
         ${isCollapsed ? "w-16" : "w-64"} ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="relative py-1.5 px-2 flex items-center gap-2 border-b border-[var(--border-color)]">
          <img
            src={adminMd}
            className={`${isCollapsed && "mx-auto"} h-[44px] w-[44px]`}
            alt="admin"
          />
          {!isCollapsed && (
            <h1 className="text-xl font-semibold tracking-wide">Ventor</h1>
          )}
          <button
            onClick={() => dispatch(toggleCollapse())}
            className="hidden lg:block rounded-full absolute -right-[13px]  bg-[var(--warning-dark)] hover:bg-[var(--hover-warning-dark)] transition text-white p-1 cursor-pointer"
          >
            {isCollapsed ? (
              <FiChevronsRight size={18} />
            ) : (
              <FiChevronsLeft size={18} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 p-1">
          <ul>
            {sidebarMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <li
                    className={`flex items-center gap-3 py-2 px-1 rounded-md mt-1 hover:bg-[var(--bg-teal-light2)] border-l-4 ${
                      isActive
                        ? "border-[var(--border-teal)] bg-[var(--bg-teal-light)] transition"
                        : "border-transparent"
                    }`}
                  >
                    <Icon size={20} className={`${isCollapsed && "mx-auto"}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </li>
                </Link>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
