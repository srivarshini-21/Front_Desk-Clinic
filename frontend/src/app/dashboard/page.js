'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      router.push('/login');
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto text-text-dark bg-white/90 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-primary">Admin Dashboard</h1>

      <p className="mb-6 text-lg">
        Welcome to the clinic’s front desk system. As a front desk staff member, you can manage and
        organize clinic operations smoothly using the following features:
      </p>

      <ul className="list-disc pl-6 space-y-4 text-base">
        <li>
          <strong>🧾 Manage Patient Queue:</strong><br />
          View the current list of patients waiting for consultation. Add new walk-in patients to the
          queue or remove served patients.
        </li>

        <li>
          <strong>📅 Handle Appointments:</strong><br />
          Book new appointments for patients, view upcoming appointments, and reschedule or cancel
          existing ones as needed.
        </li>

        <li>
          <strong>🧑‍⚕️ Doctor Management:</strong><br />
          View a list of doctors currently working at the clinic. Add new doctors, update their
          availability or working hours, or remove those who are no longer active.
        </li>

        <li>
          <strong>📜 Appointment History:</strong><br />
          Browse the history of all appointments for reference, including patient name, doctor name,
          time, and status (completed, cancelled, etc.).
        </li>

        <li>
          <strong>🚪 Logout:</strong><br />
          Click the Logout button in the top-right navigation bar to securely end your session.
        </li>
      </ul>

      <p className="mt-8 text-sm text-gray-600">
        Need help? Contact the clinic IT support for assistance or feature requests.
      </p>
    </div>
  );
}
