import React, { useEffect, useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../utilities/axiosinstance';

const ProfileModal = ({ open, onClose }) => {
    const User = useSelector((state) => state.user);
    const userId = User?.user?.user?.id;
 
  const [user, setUser] = useState(null);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const userRes = await axiosInstance.get(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(userRes.data.user);

      const flatsRes = await axiosInstance.get(`/api/flats/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFlats(flatsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlat = async (flatId) => {
    try {
      await axiosInstance.delete(`/api/flats/${flatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFlats((prev) => prev.filter((f) => f._id !== flatId));
    } catch (err) {
      console.error('Failed to delete flat:', err);
    }
  };

  const handleEditFlat = (flatId) => {
    window.location.href = `/edit-flat/${flatId}`;
  };

  useEffect(() => {
    if (open && userId) {
      fetchUserData();
    }
  }, [open, userId]);

  if (!open || !userId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6 overflow-y-auto max-h-[90vh] relative">
        <button
          className="absolute top-4 right-6 text-gray-500 text-xl hover:text-red-500"
          onClick={onClose}
        >
          ✖
        </button>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img
                src={user?.profilePic || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mx-auto"
              />
              <div className="text-center">
                <p className="font-bold text-gray-600 text-lg">{user?.name}</p>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-gray-600">{user?.phone}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg text-gray-600 font-semibold mb-2">My Flats</h2>
              {flats.length === 0 ? (
                <p className="text-sm text-muted-foreground">No flats listed.</p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {flats.map((flat) => (
                    <div
                      key={flat._id}
                      className="border p-3 rounded-lg shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-600 text-base">{flat.hostelName}</h3>
                        <p className="text-sm text-gray-600">{flat.city}</p>
                      </div>
                      <div className="flex gap-3">
                        {/* <button
                          onClick={() => handleEditFlat(flat._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil className="w-5 h-5" />
                        </button> */}
                        <button
                          onClick={() => handleDeleteFlat(flat._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
