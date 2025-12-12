function FormFields({
  type = "text",
  label,
  error,
  value,
  name,
  onChange,
  placeholder,
  options = [],
  extraComponent,
  onKeyPress,
  disabled = false,
}) {
  const baseInputStyles =
    "w-full p-2 border border-[var(--border-color)] \
   focus:border-[var(--border-teal)] \
   focus:ring-2 focus:ring-[var(--ring-teal)] \
   rounded shadow-sm outline-none transition \
   text-[var(--text-main)] bg-[var(--bg-white)]";

  const errorStyle = error
    ? "border-[var(--border-danger)] \
     focus:ring-2 focus:ring-[var(--ring-danger)] \
     focus:border-[var(--border-danger)]"
    : "border-[var(--border-color)] \
     focus:ring-2 focus:ring-[var(--ring-teal)] \
     focus:border-[var(--border-teal)]";

  const disabledStyle = disabled
    ? "bg-gray-100 cursor-not-allowed opacity-70"
    : "bg-[var(--background)]";

  const placeholderStyle = "placeholder-[var(--text-muted)]";

  const sharedProps = {
    id: name,
    name,
    onChange,
    onKeyPress,
    disabled,
    value: value || "",
    className: `${baseInputStyles} ${errorStyle} ${disabledStyle} ${placeholderStyle}`,
  };

  const renderField = () => {
    switch (type) {
      case "select":
        return (
          <select {...sharedProps}>
            <option value="" disabled>
              Select an option
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            {...sharedProps}
            rows={3}
            placeholder={placeholder}
            className={`${sharedProps.className} resize-vertical`}
          />
        );

      case "file":
        return (
          <input
            {...sharedProps}
            type="file"
            accept="image/*"
            className={`${baseInputStyles} ${errorStyle} ${disabledStyle} file:mr-2 file:py-1 file:px-3
            file:rounded file:border-0 file:text-sm file:font-medium 
            file:bg-[var(--accent)] file:text-white hover:file:bg-[var(--hover-accent)]
            file:transition file:duration-200 file:cursor-pointer cursor-pointer`}
          />
        );

      default:
        return <input {...sharedProps} type={type} placeholder={placeholder} />;
    }
  };
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm text-[var(--text-main)]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {renderField()}
        {extraComponent && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {extraComponent}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormFields;
