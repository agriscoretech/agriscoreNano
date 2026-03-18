import React from 'react'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import SensorData from './pages/SensorData';
 import FarmerDashboard from "./pages/FarmerDashboard";
import AddDevice from "./pages/AddDevice";
import { BrowserRouter, Routes,Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/devices' element={<Devices/>}/>
<Route path="/sensor-data/:deviceId" element={<SensorData />} />

   

<Route path="/farmer-dashboard" element={<FarmerDashboard />} />
<Route path="/add-device" element={<AddDevice />} />
    </Routes  >
    </BrowserRouter>
  )
}

export default App;