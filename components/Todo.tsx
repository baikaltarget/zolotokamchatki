import { showTodo, todoText } from "@/lib/site";
/** Обёртка для мест, где ждём данные заказчика. Красная рамка выключается в site.json → todo.showTodoFrames */
export default function Todo({ k, text, children, className = "" }: { k?: string; text?: string; children: React.ReactNode; className?: string }) {
  const t = text ?? todoText(k);
  if (!showTodo || !t) return <div className={className}>{children}</div>;
  return <div className={`todo ${className}`} data-todo={t}>{children}</div>;
}
