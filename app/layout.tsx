import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallBar from "@/components/CallBar";
import JsonLd from "@/components/JsonLd";
import { orgLd, localBusinessLd } from "@/lib/seo";
import { BRAND } from "@/lib/site";
import Script from "next/script";
import CookieBar from "@/components/CookieBar";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: { default: `${BRAND.name} — красная икра и рыба в Иркутске`, template: `%s` },
  description: "Красная икра с Камчатки, рыба холодного копчения и слабого посола в Иркутске. ТЦ «Кедр», доставка по городу.",
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }], apple: "/apple-icon.png", shortcut: "/favicon.ico" },
  robots: { index: true, follow: true },
  other: { "yandex-verification": "1013521ce6a6f470" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <JsonLd data={[orgLd, localBusinessLd]} />
        <Header />
        <main>{children}</main>
        <Footer />
        <CallBar />
        <CookieBar />
        <Script id="metrika" strategy="afterInteractive">{`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=112026044', 'ym');ym(112026044, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`}</Script>
        <noscript><div><img src="https://mc.yandex.ru/watch/112026044" style={{position:"absolute",left:"-9999px"}} alt="" /></div></noscript>
        <Script id="goals" strategy="afterInteractive">{`document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a'):null;if(!a||typeof ym==='undefined')return;var h=a.getAttribute('href')||'';function g(n){ym(112026044,'reachGoal',n)}if(h.indexOf('tel:')===0){g('phone_click');if(location.pathname.indexOf('/opt')===0)g('opt_lead')}else if(h.indexOf('t.me/Svetlana_irk')>-1){g('tg_click');if(location.pathname.indexOf('/opt')===0)g('opt_lead')}else if(h.indexOf('max.ru')>-1)g('max_click');else if(h.indexOf('2gis')>-1||h.indexOf('yandex.ru/profile')>-1||h.indexOf('yandex.ru/maps')>-1)g('route_click')});`}</Script>
      </body>
    </html>
  );
}
