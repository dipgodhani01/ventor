import { LoaderBtn } from "../common/Loader";

function Button({
  text,
  loading = false,
  round = false,
  className = "",
  action,
  type = "button",
  icon,
  disabled = false,
  bg,
  hover,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={(e) => {
        if (type === "submit") return;
        if (!disabled && typeof action === "function") {
          action(e);
        }
      }}
      className={`${loading ? "py-1" : "py-1.5"}
        text-sm tracking-wide
        overflow-hidden select-none text-white transition
        ${icon ? "flex gap-2 items-center justify-center" : ""}
        ${round ? "rounded-full" : "rounded"}
        ${bg}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${hover}
        ${className}
      `}
    >
      {icon && icon}
      {loading ? <LoaderBtn /> : text}
    </button>
  );
}

export default Button;
