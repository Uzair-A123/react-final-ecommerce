import {useLocalStorage} from "../../hooks/useLocalStorage";
import { useTheme } from "../../context/ThemeContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [prefs, setPrefs] = useLocalStorage("settings", { notifications: true, language: "English", newsletter: false, twoStep: false, publicEmail: false });
  const update = (key, value) => setPrefs({ ...prefs, [key]: value });
  return (
    <div className="w-full max-w-md flex-col gap-3 flex rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 text-2xl font-semibold">Settings</h2>
      <label><input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} /> Dark mode</label>
      <label><input type="checkbox" checked={prefs.notifications} onChange={(e) => update("notifications", e.target.checked)} /> Notifications</label>
      <label><input type="checkbox" checked={prefs.newsletter} onChange={(e) => update("newsletter", e.target.checked)} /> Email newsletter</label>
      <label><input type="checkbox" checked={prefs.twoStep} onChange={(e) => update("twoStep", e.target.checked)} /> Two-step verification</label>
      <label><input type="checkbox" checked={prefs.publicEmail} onChange={(e) => update("publicEmail", e.target.checked)} /> Show my email on my profile</label>
      <label>Language
        <select value={prefs.language} onChange={(e) => update("language", e.target.value)}>
          <option>English</option><option>Urdu</option><option>Arabic</option>
        </select>
      </label>
    </div>
  );
}
