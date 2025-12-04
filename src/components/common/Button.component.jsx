const Button = ({
  type = "submit",
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "sm",
  fullWidth = false,
  children,
  className = "",
}) => {
  const VARIANTS = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  const SIZES = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        rounded transition-all duration-150 ease-in-out
        ${VARIANTS[variant]} ${SIZES[size]}
        ${fullWidth ? "w-full" : ""}
        ${loading || disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}>
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
