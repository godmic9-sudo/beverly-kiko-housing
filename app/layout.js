import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Beverly and Kiko Housing Property Uganda',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
