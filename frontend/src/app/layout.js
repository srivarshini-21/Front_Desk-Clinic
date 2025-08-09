import './globals.css';
import LayoutWrapper from '../components/LayoutWrapper';

export const metadata = {
  title: 'Clinic Front Desk System',
  description: 'Manage patients and appointments',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-cover bg-center bg-no-repeat pt-20 px-4"
        style={{ backgroundImage: "url('/clinic-bg.jpg')" }}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
