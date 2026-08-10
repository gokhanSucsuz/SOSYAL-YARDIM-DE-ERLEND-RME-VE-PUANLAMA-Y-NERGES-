import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'SOSYAL YARDIM DEĞERLENDİRME VE İNCELEME SİSTEMİ',
  description: 'Sosyal Yardım Değerlendirme ve İnceleme Sistemi',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
