import { Link } from "react-router-dom";
import logo from "../assets/logo (1).png"
function Sidebar() {
  return (
    <div className="w-full h-20 bg-green-700 text-white dark:bg-gray-900 dark:text-gray-100 p-4 flex items-center overflow-hidden">
     <Link to="/dashboard"><img className="w-35 max-w-full h-auto object-contain" src={logo} alt="logo" /></Link>

      
    </div>
  );
}

export default Sidebar;