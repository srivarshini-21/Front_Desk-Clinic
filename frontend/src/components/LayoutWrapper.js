'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideNavbarPaths = ['/login'];
  const showNavbar = !hideNavbarPaths.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="flex items-center justify-center">{children}</main>
    </>
  );
}
