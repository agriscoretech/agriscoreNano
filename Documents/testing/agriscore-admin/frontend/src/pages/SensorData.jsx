import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SensorData() {

  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`https://agriscorenanopro.onrender.com/api/sensor-data/${deviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(result => {
        console.log("Sensor API response:", result);

        if (Array.isArray(result)) {
          setData(result);
        } else if (result.data) {
          setData(result.data);
        } else {
          setData([]);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch sensor data:", err);
        setError("Failed to load device data");
        setLoading(false);
      });
  }, [deviceId, navigate]);

  const locations = [...new Set(data.map(item => item.location).filter(Boolean))];

  const filteredData = locationFilter === "all"
    ? data
    : data.filter(item => item.location === locationFilter);

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="p-4 sm:p-6 md:p-8 w-full">

        {loading && <p>Loading device data...</p>}
        {error && <p>{error}</p>}

        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          ← Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Device Data: {deviceId}
        </h1>

        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-medium">Filter by Location:</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 dark:bg-gray-700 text-xs sm:text-sm uppercase">
              <tr>
                <th className="p-2 sm:p-3">Date</th>
                <th className="p-2 sm:p-3">Temp</th>
                <th className="p-2 sm:p-3">Humidity</th>
                <th className="p-2 sm:p-3">pH</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredData.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                    No sensor data available for this device
                  </td>
                </tr>
              )}
              {!loading && filteredData.map(item => (
                <tr key={item._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2 sm:p-3">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="p-2 sm:p-3">{item.temperature}</td>
                  <td className="p-2 sm:p-3">{item.humidity}</td>
                  <td className="p-2 sm:p-3">{item.ph}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default SensorData;