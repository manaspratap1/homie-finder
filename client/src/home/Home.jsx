import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUserProfileThunk, logoutUserThunk } from "../store/slice/user/user.thunk";
import HostelDetailsModal from "./flatDetailsModal";
import { axiosInstance } from "../utilities/axiosinstance";
import ProfileModal from "./profileModal";

function Home() {
  const [selectedListing, setSelectedListing] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hostelListings, setHostelListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListing, setNewListing] = useState({
    hostelName: "",
    city: "",
    address: "",
    landmark: "",
    capacity: "",
    rent: "",
    description: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log("Redux user state:", user);

  useEffect(() => {
    fetchHostels();

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          navigate("/login");
        } else {
          if (decoded.id) {
            dispatch(getUserProfileThunk(decoded.id));
            setIsLoggedIn(true);
          } else {
            console.error("User ID is missing in token.");
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Error decoding the token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [dispatch, navigate]);

  const fetchHostels = async () => {
    try {
      const response = await axiosInstance.get("/api/flats");
      setHostelListings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch hostels:", error);
      setLoading(false);
    }
  };

  

  const handleAddListingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("hostelName", newListing.hostelName);
    formData.append("city", newListing.city);
    formData.append("address", newListing.address);
    formData.append("landmark", newListing.landmark);
    formData.append("capacity", newListing.capacity);
    formData.append("rent", newListing.rent);
    formData.append("description", newListing.description);
    for (let i = 0; i < newListing.images.length; i++) {
      formData.append("images", newListing.images[i]);
    }

    try {
      const response = await axiosInstance.post("/api/flats/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHostelListings((prev) => [...prev, response.data]);
      setShowAddForm(false);
      setNewListing({
        hostelName: "",
        city: "",
        address: "",
        landmark: "",
        capacity: "",
        rent: "",
        description: "",
        images: [],
      });
      setPreviewImages([]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to add hostel:", error);
      setLoading(false);
    }
  };

  const handleProfileClick = () => setShowProfile(true);
  const handleAddClick = () => setShowAddForm(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-800 to-indigo-850 relative">
      <div className="flex justify-between bg-indigo-900 items-center px-6 py-4 bg-primary text-white shadow-md">
        <h1 className="text-2xl font-bold">roomie-finder</h1>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
              <FaUserCircle size={30} />
              <span className="ml-2">{user?.user?.name}</span>
            </div>
            <button
              onClick={() => {
                dispatch(logoutUserThunk());
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                navigate("/");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white p-2 rounded-md"
          >
            Login/Signup
          </button>
        )}
      </div>

      <div className="p-4">
  {loading ? (
    <p>Loading...</p>
  ) : hostelListings.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hostelListings.map((listing) => (
        <div
        key={listing._id}
        onClick={() => setSelectedListing(listing._id)}
        className="flex items-center bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer p-3 gap-4"
      >
        <img
          src={listing.images?.[0] || "/placeholder.jpg"}
          alt={listing.hostelName}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex flex-col justify-between w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-primary">{listing.hostelName}</h3>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              ₹{listing.rent}/month
            </span>
          </div>
          <p className="text-sm text-gray-600">{listing.address}, {listing.city}</p>
          <div className="flex items-center text-sm text-gray-500 gap-4 mt-1">
            <span>🛏️ {listing.capacity} beds</span>
            <span>📍 Near {listing.landmark}</span>
          </div>
        </div>
      </div>
      
      ))}
    </div>
  ) : (
    <p>No hostel listings available</p>
  )}
</div>


      {isLoggedIn && (
        <button
          onClick={handleAddClick}
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
        >
          <FiPlus size={24} />
        </button>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-md w-full rounded-xl shadow-xl p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl hover:text-red-500"
              onClick={() => setShowAddForm(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-primary mb-4">Add Hostel</h2>
            <form onSubmit={handleAddListingSubmit} className="space-y-4">
              {["hostelName", "city", "address", "landmark", "capacity", "rent", "description"].map(
                (field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    value={newListing[field]}
                    onChange={(e) => setNewListing({ ...newListing, [field]: e.target.value })}
                    className="input input-bordered w-full"
                  />
                )
              )}
              <div>
                <label className="block text-sm mb-2">Upload Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    setNewListing({ ...newListing, images: e.target.files });
                    setPreviewImages(Array.from(e.target.files).map((file) => URL.createObjectURL(file)));
                  }}
                  className="file-input file-input-bordered w-full"
                />
                <div className="flex gap-2 mt-4">
                  {previewImages.map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt={`preview ${image}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`}>
                Add Hostel
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedListing && (
        <HostelDetailsModal
          hostelId={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    {showProfile && (
  <ProfileModal
    open={true}
    onClose={() => setShowProfile(false)}
  />
)}




    </div>
  );
}

export default Home;
