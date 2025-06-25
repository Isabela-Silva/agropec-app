import React from "react";
import AppRoutes from "./AppRoutes";
import PWABadge from "./PWABadge";

const App: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
      <AppRoutes />
      <PWABadge />
    </div>
  );
};

export default App;
