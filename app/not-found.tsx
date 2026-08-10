import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
      <h2 className="text-2xl font-bold mb-2">Sayfa Bulunamadı</h2>
      <p className="text-slate-600 mb-4">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
