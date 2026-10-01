const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 border-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700 border-transparent",
};
export default function Button({ children, variant = "primary", ...props }) {
  return (
    <button className={`rounded-md px-4 py-2 font-medium transition ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
