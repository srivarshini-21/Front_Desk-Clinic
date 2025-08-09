'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Queue', path: '/queue' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Doctors', path: '/doctors' },    

  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-300 shadow-md z-30 w-full px-6 py-3 fixed top-0 left-0">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <span className="text-xl font-bold text-primary">Clinic Desk</span>
        <ul className="flex space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`hover:text-primary transition ${
                  pathname === item.path ? 'text-primary underline' : 'text-text-dark'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-primary font-medium transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
