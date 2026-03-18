import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Devices() {
  const [devices, setDevices] = useState([]);

  // 🔥 Function to check live status
  const isOnline = (device) => {
    if (!device.lastSeen) return false;
    return (Date.now() - new Date(device.lastSeen)) < 2 * 60 * 1000;
  };

  const getLastSeenText = (lastSeen) => {
    if (!lastSeen) return "Never";

    const diff = Date.now() - new Date(lastSeen);
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://agriscorenanopro.onrender.com/api/devices", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/";
          return [];
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setDevices(data);
        } else if (data.devices) {
          setDevices(data.devices);
        } else {
          setDevices([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch devices:", err);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => [...prev]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 md:p-8 w-full">

        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Devices
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead className="bg-gray-200 dark:bg-gray-700 text-xs sm:text-sm uppercase">
              <tr>
                <th className="p-2 sm:p-3">Device ID</th>
                <th className="p-2 sm:p-3">Location</th>
                <th className="p-2 sm:p-3">Status</th>
                <th className="p-2 sm:p-3">Last Seen</th>
                <th className="p-2 sm:p-3"> Data</th>
              </tr>
            </thead>

            <tbody>
              {devices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center">No devices found</td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr
                    key={device._id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-2 sm:p-3">{device.deviceId}</td>
                    <td className="p-2 sm:p-3">{device.location}</td>
                    <td className="p-2 sm:p-3">
                      <span className={`flex items-center gap-2 font-medium ${isOnline(device) ? "text-green-600" : "text-red-600"}`}>
                        <span className={`w-2 h-2 rounded-full ${isOnline(device) ? "bg-green-500" : "bg-red-500"}`}></span>
                        {isOnline(device) ? "online" : "offline"}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="flex flex-col">
                        <span>
                          {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : "-"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getLastSeenText(device.lastSeen)}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <Link
                        to={`/sensor-data/${device.deviceId}`}
                        className="bg-green-500 rounded-lg py-1 px-2 transition duration-200 text-xs sm:text-sm hover:bg-green-600 text-white hover:text-black"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default Devices;