'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [phone, setContact] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      router.push('/login');
    }
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/doctors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSpecialization('');
    setContact('');
    setEditMode(false);
    setEditId(null);
  };

  const addDoctor = async (e) => {
    e.preventDefault();
    if (editMode) {
      try {
        const res = await fetch(`http://localhost:3001/api/doctors/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, specialization, phone }),
        });
        if (res.ok) {
          fetchDoctors();
          resetForm();
        } else {
          alert('Error updating doctor');
        }
      } catch (error) {
        console.error('Error updating doctor:', error);
      }
    } else {
      try {
        const res = await fetch('http://localhost:3001/api/doctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, specialization, phone }),
        });
        if (res.ok) {
          fetchDoctors();
          resetForm();
        } else {
          alert('Error adding doctor');
        }
      } catch (error) {
        console.error('Error adding doctor:', error);
      }
    }
  };

  const handleEdit = (doctor) => {
    setEditMode(true);
    setEditId(doctor.id);
    setName(doctor.name ?? '');
    setSpecialization(doctor.specialization ?? '');
    setContact(doctor.phone ?? '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteDoctor = async (id) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchDoctors();
      } else {
        alert('Error deleting doctor');
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Doctor Management</h1>

      {/* Add Doctor Form */}
      <form
        onSubmit={addDoctor}
        className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <input
          type="text"
          placeholder="Name"
          value={name ?? ''}
          onChange={(e) => setName(e.target.value)}
          className="border border-primary p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Specialization"
          value={specialization ?? ''}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border border-primary p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Contact"
          value={phone ?? ''}
          onChange={(e) => setContact(e.target.value)}
          className="border border-primary p-2 rounded w-full"
          required
        />
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            {editMode ? 'Update Doctor' : 'Add Doctor'}
          </button>
        </div>
      </form>

  {/* Doctors List */}
  {loading ? (
    <p>Loading doctors...</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="doctors-table w-full min-w-full sm:min-w-[500px]">
        <thead>
          <tr className="bg-gray-200 text-sm sm:text-base">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Specialization</th>
            <th className="p-2 border">Contact</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id} className="text-sm sm:text-base">
              <td className="p-2 border">{doc.name}</td>
              <td className="p-2 border">{doc.specialization}</td>
              <td className="p-2 border">{doc.phone}</td>
              <td className="p-2 border flex flex-col sm:flex-row gap-1 sm:gap-2">
                <button
                  onClick={() => deleteDoctor(doc.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(doc)}
                  className="bg-primary text-white px-3 py-1 rounded text-xs sm:text-sm"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {doctors.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-2">
                No doctors found
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
