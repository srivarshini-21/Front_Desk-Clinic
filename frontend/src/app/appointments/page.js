'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:3001/api';

export default function AppointmentsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // <-- track editing mode

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      router.push('/login');
    }
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    await Promise.all([fetchDoctors(), fetchAppointments()]);
    setLoading(false);
  }

  async function fetchDoctors() {
    try {
      const res = await fetch(`${API_BASE}/doctors`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchDoctors error', err);
      setDoctors([]);
    }
  }

  async function fetchAppointments() {
    try {
      const res = await fetch(`${API_BASE}/appointments`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchAppointments error', err);
      setAppointments([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!patientName || !doctorId || !date || !time) {
      alert('Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing
        const res = await fetch(`${API_BASE}/appointments/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            patientName,
            doctorId: Number(doctorId),
            date,
            time,
          }),
        });
        if (!res.ok) {
          alert('Failed to update appointment');
          return;
        }
      } else {
        // Create new
        const res = await fetch(`${API_BASE}/appointments`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            patientName,
            doctorId: Number(doctorId),
            date,
            time,
          }),
        });
        if (!res.ok) {
          alert('Failed to book appointment');
          return;
        }
      }

      // Clear form after success
      resetForm();
      fetchAppointments();
    } catch (err) {
      console.error('appointment submit error', err);
      alert('Something went wrong');
    }
  }

  function resetForm() {
    setPatientName('');
    setDoctorId('');
    setDate('');
    setTime('');
    setEditingId(null);
  }

  async function handleCancel(id) {
    if (!confirm('Cancel this appointment?')) return;
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
        method: 'POST',
        headers,
      });
      if (!res.ok) {
        alert('Failed to cancel');
        return;
      }
      fetchAppointments();
    } catch (err) {
      console.error('cancel error', err);
      alert('Error cancelling appointment');
    }
  }

  function handleReschedule(appt) {
    setPatientName(appt.patientName);
    setDoctorId(appt.doctor?.id || '');
    setDate(appt.date);
    setTime(appt.time);
    setEditingId(appt.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Appointment Manager</h1>

      <div className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
          <input
            type="text"
            placeholder="Patient name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.specialization}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded w-1/2"
            />
            <input
              type="text"
              placeholder='Time'
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border p-2 rounded w-1/2"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
              {editingId ? 'Update Appointment' : 'Book Appointment'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-accent text-white px-4 py-2 rounded"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold mb-3">Appointment History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Patient</th>
                <th className="p-2 text-left">Doctor</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-2">{a.patientName}</td>
                  <td className="p-2">
                    {a.doctor?.name} ({a.doctor?.specialization})
                  </td>
                  <td className="p-2">{a.date}</td>
                  <td className="p-2">{a.time}</td>
                  <td className="p-2">{a.status}</td>
                  <td className="p-2 space-x-2">
                    {a.status === 'Booked' && (
                      <>
                        <button
                          onClick={() => handleReschedule(a)}
                          className="bg-accent text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(a.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-2 text-center">
                    No appointments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
