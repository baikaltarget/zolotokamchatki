/** Мягкое форматирование телефона: ничего не блокирует, вставку из буфера не ломает */
export function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (!d) return "";
  // 8 900… и 7 900… приводим к российскому виду
  if (d[0] === "8") d = "7" + d.slice(1);
  if (d[0] === "9" && d.length <= 10) d = "7" + d;
  if (d[0] !== "7") return "+" + d.slice(0, 15); // зарубежный номер — не трогаем структуру
  d = d.slice(0, 11);
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
  let out = "+7";
  if (p[0]) out += " " + p[0];
  if (p[1]) out += " " + p[1];
  if (p[2]) out += "-" + p[2];
  if (p[3]) out += "-" + p[3];
  return out;
}

/** Достаточно ли цифр, чтобы считать номер введённым */
export function isPhoneValid(v: string): boolean {
  const d = v.replace(/\D/g, "");
  return d.startsWith("7") ? d.length === 11 : d.length >= 10;
}
