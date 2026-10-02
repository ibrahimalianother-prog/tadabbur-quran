import './globals.css';

export const metadata = {
  title: 'تدبر القرآن الكريم',
  description: 'موقع لتدبر القرآن الكريم، البحث في الآيات، واستعراض مصادر التفسير بشكل آمن وموثوق.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
