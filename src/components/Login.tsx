import { fetchAuth } from "@/utils/immutable";
import React, { useState } from "react";

function Login() {
  const [loading, setLoading] = useState(false);

  const headerHeight = 4.6;
  
  return (
    <div className="flex items-center justify-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Please Login</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await fetchAuth();
            setLoading(false);
          }}
        >
          {loading ? "Loading..." : "Log in with Passport"}
        </button>
      </div>
    </div>
  );
}

export default Login;
