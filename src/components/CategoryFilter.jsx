export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full capitalize sm:w-56">
      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}
