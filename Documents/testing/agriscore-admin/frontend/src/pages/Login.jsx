import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {

    if (pin.length !== 6) {
      alert("PIN must be 6 digits");
      return;
    }

    const endpoint = isRegister ? "register" : "login";

    try {
      const res = await fetch(`https://agriscorenanopro.onrender.com/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, pin })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      if (isRegister) {
        alert("Account created. Please login.");
        setIsRegister(false);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // Redirect based on role
        if (data.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/farmer-dashboard");
        }
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 p-10 rounded shadow-md w-96">

        <h1 className="text-2xl font-bold mb-6 text-center">
          AgriScore Admin
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 mb-4 rounded text-gray-900 dark:text-gray-100"
        />

        <input
          type="password"
          placeholder="6 Digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={6}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 mb-6 rounded text-gray-900 dark:text-gray-100"
        />

        <button
          onClick={handleAuth}
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          {isRegister ? "Create Account" : "Login"}
        </button>

        <p
          onClick={() => setIsRegister(!isRegister)}
          className="text-center mt-4 text-sm cursor-pointer text-green-600 dark:text-green-400"
        >
          {isRegister ? "Already have an account? Login" : "Create an account"}
        </p>

      </div>
    </div>
  );
}

export default Login;