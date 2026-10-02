import './globals.css';

export const metadata = {
  title: 'تدبر القرآن الكريم',
  description: 'Website for reflecting on the Quran and exploring sources of tafsir safely.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
