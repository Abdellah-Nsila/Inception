import { FiMoon, FiSun, FiMonitor } from "react-icons/fi";
import { useTheme } from "@/components/theme-provider";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm w-fit">
      {/* Light Mode Button */}
      <button
        onClick={() => setTheme("light")}
        className={`rounded-full p-2 transition-all cursor-pointer ${
          theme === "light"
            ? "bg-zinc-100 text-amber-500 dark:bg-zinc-800"
            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        }`}
        title="Light Mode"
      >
        <FiSun className="h-4 w-4" />
      </button>
      
      {/* Dark Mode Button */}
      <button
        onClick={() => setTheme("dark")}
        className={`rounded-full p-2 transition-all cursor-pointer ${
          theme === "dark"
            ? "bg-zinc-100 text-indigo-400 dark:bg-zinc-800"
            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        }`}
        title="Dark Mode"
      >
        <FiMoon className="h-4 w-4" />
      </button>

      {/* System Default Button */}
      <button
        onClick={() => setTheme("system")}
        className={`rounded-full p-2 transition-all cursor-pointer ${
          theme === "system"
            ? "bg-zinc-100 text-teal-500 dark:bg-zinc-800"
            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        }`}
        title="System Default"
      >
        <FiMonitor className="h-4 w-4" />
      </button>
    </div>
  );
}
