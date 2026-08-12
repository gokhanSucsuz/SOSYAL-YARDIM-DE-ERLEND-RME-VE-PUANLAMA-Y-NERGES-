import { type ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const viewport = {
  themeColor: "#1e293b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata = {
  title: "Sosyal Yardım Kriter",
  description: "Sosyal İnceleme ve Saha Araştırmaları Yönetim Paneli",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sosyal Yardım Kriter",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sosyal Yardım Kriter" />
        <meta name="application-name" content="Sosyal Yardım Kriter" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('ServiceWorker registered with scope: ', reg.scope);
                  }).catch(function(err) {
                    console.log('SW registration failed: ', err);
                  });
                });
              }

              // Keep PWA links inside standalone mode on iOS & Android
              if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
                document.addEventListener('click', function(e) {
                  var target = e.target;
                  while (target && target.nodeName !== 'A') {
                    target = target.parentNode;
                  }
                  if (target && target.href && target.href.indexOf(window.location.host) !== -1) {
                    if (target.target !== '_blank') {
                      e.preventDefault();
                      window.location.href = target.href;
                    }
                  }
                }, false);
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
