import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddDevice() {
  const [deviceId, setDeviceId] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    if (!deviceId || !location) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("https://agriscorenanopro.onrender.com/api/devices/farmer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ deviceId, location })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.toLowerCase().includes("exist")) {
          alert("⚠️ This device is already registered to your account");
        } else if (data.message?.toLowerCase().includes("author")) {
          alert("❌ This device belongs to another farmer");
        } else {
          alert(data.message || "Failed to add device");
        }
        return;
      }

      alert("Device added successfully");
      navigate("/farmer-dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Add Device
        </h1>

        <input
          type="text"
          placeholder="Device ID (e.g. AGRI_101)"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 mb-4 rounded text-gray-900 dark:text-gray-100"
        />

        <input
          type="text"
          placeholder="Location (e.g. Agarpara)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 mb-6 rounded text-gray-900 dark:text-gray-100"
        />

        <button
          onClick={handleAdd}
          disabled={!deviceId || !location}
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Add Device
        </button>
      </div>
    </div>
  );
}

export default AddDevice;