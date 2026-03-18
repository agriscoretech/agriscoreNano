import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FarmerDashboard() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ✅ NEW: Send phone GPS location to backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const location = `${lat},${lng}`;

      try {
        await fetch("https://agriscorenanopro.onrender.com/api/devices/update-location", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ location })
        });
      } catch (err) {
        console.error("Failed to update location", err);
      }

    }, () => {
      console.log("Location permission denied");
    });

  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchDevices = () => {
      fetch("https://agriscorenanopro.onrender.com/api/devices/farmer", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Unauthorized or failed request");
          }
          return res.json();
        })
        .then(data => {
          setDevices(Array.isArray(data) ? data : []);
          setLastUpdated(new Date());
        })
        .catch(err => {
          console.error(err);
          setDevices([]);
        });
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const totalDevices = devices.length;
  const activeDevices = devices.filter(d => {
    if (!d.lastSeen) return false;
    return (Date.now() - new Date(d.lastSeen)) < 2 * 60 * 1000;
  }).length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 md:p-8">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
          Farmer Dashboard
        </h1>

        <div className="flex items-center gap-2 text-green-500 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v14m0 0l-5-5m5 5l5-5"
            />
          </svg>
          Live Data
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/add-device")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
          >
            + Add Device
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "--"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,255,150,0.15)] transition duration-300">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Total Devices
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold mt-2 bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
            {totalDevices}
          </p>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,255,150,0.15)] transition duration-300">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Active Devices
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold mt-2 bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
            {activeDevices}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

        {devices.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">No devices found</p>
        ) : (
          devices.map(device => {
            const isOnline = device.lastSeen && (Date.now() - new Date(device.lastSeen)) < 2 * 60 * 1000;

            return (
              <div
                key={device._id}
                className="relative bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition duration-300 cursor-pointer"
                onClick={() => navigate(`/sensor-data/${device.deviceId}`)}
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {device.deviceId}
                </h2>

                <p className="text-gray-500 text-sm mb-2">
                  {device.currentLocation || device.location}
                </p>

                <p className="text-sm text-gray-400">
                  Last seen: {device.lastSeen ? new Date(device.lastSeen).toLocaleTimeString() : "--"}
                </p>

                <span className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full ${isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {isOnline ? "Live" : "Offline"}
                </span>
              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

export default FarmerDashboard;