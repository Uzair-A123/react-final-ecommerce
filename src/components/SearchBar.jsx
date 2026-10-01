import { forwardRef } from "react";

const SearchBar = forwardRef(function SearchBar({ value, onChange, placeholder = "Search products..." }, ref) {
  return (
    <input
      ref={ref}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full sm:flex-1"
    />
  );
});
export default SearchBar;
