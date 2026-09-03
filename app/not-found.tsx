import Link from "next/link";
export default function NotFound() {
  return <section className="wrap py-20 text-center"><h1>Такой страницы нет</h1><p className="mt-3 text-stone">Зато есть икра.</p><Link href="/ikra" className="btn btn-caviar mt-6">К витрине</Link></section>;
}
