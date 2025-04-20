import { useEffect, useState } from "react";
import { axiosInstance } from "../utilities/axiosinstance";

function HostelDetailsModal({ hostelId, onClose }) {
  const [hostelDetails, setHostelDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/flats/${hostelId}`);
        setHostelDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch hostel details:", error);
        setLoading(false);
      }
    };

    if (hostelId) {
      fetchHostelDetails();
    }
  }, [hostelId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!hostelDetails) {
    return <p>Hostel details not found.</p>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow-xl p-6 relative">
        <button
          className="absolute top-2 right-3 text-gray-500 text-xl hover:text-red-500"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-primary mb-4">{hostelDetails.hostelName}</h2>
        <p className="text-lg text-black font-semibold">City: {hostelDetails.city}</p>
        <p className = "text-lg text-black font-semibold">Address: {hostelDetails.address}</p>
        <p className="text-lg text-black font-semibold">Capacity: {hostelDetails.capacity}</p>
        <p className="mt-2 text-black">Contact: {hostelDetails.owner.phone}</p>
        <p className="mt-2 text-black">owner: {hostelDetails.owner.name}</p>
        <p className="mt-2 text-black">Description: {hostelDetails.description}</p>
        <div className="mt-4">
          <h3 className="font-semibold">Images</h3>
          <div className="flex gap-2">
            {hostelDetails.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`image-${index}`}
                className="w-24 h-24 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostelDetailsModal;
