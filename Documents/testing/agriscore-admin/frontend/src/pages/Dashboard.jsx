import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Devices from "./Devices";
import { Activity, Cpu, Database } from "lucide-react";
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [sensorRecords, setSensorRecords] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = () => {
      fetch("https://agriscorenanopro.onrender.com/api/devices", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            navigate("/");
            return [];
          }
          return res.json();
        })
        .then(data => setDevices(data || []));

      fetch("https://agriscorenanopro.onrender.com/api/sensor-data", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            navigate("/");
            return [];
          }
          return res.json();
        })
        .then(data => setSensorRecords(Array.isArray(data) ? data.length : 0))
        .catch(() => setSensorRecords(0));

      setLastUpdated(new Date());
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);

  }, [navigate]);

  const totalDevices = devices.length;
  const activeDevices = devices.filter(d => {
    if (!d.lastSeen) return false;
    return (Date.now() - new Date(d.lastSeen)) < 2 * 60 * 1000;
  }).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="block min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100">

      <Sidebar />

      <div className="p-4 sm:p-6 md:p-8 w-full">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Dashboard</h1>

          <div className="flex gap-3">

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>

          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "--"}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold">Total Devices</h2>
              <Activity className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold mt-3 text-green-600">{totalDevices}</p>
            <p className="text-xs text-gray-500 mt-1">↑ steady</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold">Active Devices</h2>
              <Cpu className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold mt-3 text-green-600">{activeDevices}</p>
            <p className="text-xs text-gray-500 mt-1">↑ live</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold">Sensor Records</h2>
              <Database className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold mt-3 text-green-600">{sensorRecords}</p>
            <p className="text-xs text-gray-500 mt-1">↑ updating</p>
          </div>

        </motion.div>

        <div className="mt-10">
          <Devices />
        </div>

      </div>

    </div>
  );
}

export default Dashboard;