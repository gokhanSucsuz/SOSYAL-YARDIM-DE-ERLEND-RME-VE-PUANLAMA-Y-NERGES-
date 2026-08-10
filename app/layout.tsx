import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Sosyal Yardım İnceleme ve Nesnel Değerlendirme Sistemi',
  description: 'Sosyal Yardım İnceleme ve Nesnel Değerlendirme Sistemi (SYD-NDS) Sosyal Adalet, Hakkaniyetli Kaynak Dağıtımı ve Dijital Dönüşüm Projesi',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
