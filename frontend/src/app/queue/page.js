'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:3001/api';

export default function QueuePage() {
  const router = useRouter();
  const [queue, setQueue] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      router.push('/login');
    }
    fetchQueue();
  }, []);

  async function fetchQueue() {
    try {
      const res = await fetch(`${API_BASE}/appointments`, { headers });
      const data = await res.json();
      setQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchHistory error', err);
    }
  }

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Appointment History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Patient</th>
              <th className="p-2 text-left">Doctor</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((q) => (
              <tr key={q.id} className="border-b">
                <td className="p-2">{q.patientName}</td>
                <td className="p-2">{q.doctor?.name}</td>
                <td className="p-2">{q.date}</td>
                <td className="p-2">{q.time}</td>
                <td className="p-2">
                  {q.status === "Cancelled" ? (
                    <span className="text-red-500 font-semibold">Cancelled</span>
                 ) : (
                <select
                  value={q.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    await fetch(`${API_BASE}/appointments/${q.id}/status`, {
                      method: 'PATCH',
                      headers,
                      body: JSON.stringify({ status: newStatus }),
                    });

                    // Refresh queue after update
                    fetchQueue();
                  }}
                  className="border rounded p-1"
                >
                  <option value="Waiting">Waiting</option>
                  <option value="With Doctor">With Doctor</option>
                  <option value="Completed">Completed</option>
                </select>
              )}
              </td>

              </tr>
            ))}
            {queue.length === 0 && (
              <tr>
                <td colSpan="5" className="p-2 text-center">
                  No past appointments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
