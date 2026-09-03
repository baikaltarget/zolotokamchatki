import type { Config } from "tailwindcss";

/* ДИЗАЙН: палитра и шрифты. Контент здесь не живёт — он в content/site.json */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14283F",     // глубокий синий — герой и футер
        ink2: "#1E3A5C",    // карточки на синем
        gold: "#3B7DD8",    // морской синий — акценты и иконки
        gold2: "#8DBCF5",   // светлый синий на тёмном
        caviar: "#FF5A1F",  // оранжевый — кнопки и цены
        caviar2: "#E64A12", // оранжевый при наведении
        nerka: "#B8232A",
        ivory: "#FFFFFF",   // фон страницы
        ivory2: "#E3E9F1",  // границы карточек
        cloud: "#F2F5F9",   // чередующиеся светлые секции
        stone: "#667085",   // вторичный текст
      },
      fontFamily: {
        display: ["'Manrope Variable'", "system-ui", "sans-serif"],
        body: ["'Manrope Variable'", "system-ui", "sans-serif"],
      },
      maxWidth: { wrap: "1180px" },
      borderRadius: { tag: "6px" }
    },
  },
  plugins: [],
};
export default config;
