import React from 'react';
import { BrowserRouter, Routes } from "react-router-dom";
import { generateRoutes, routes } from "./router";
import AuthInitializer from "./pages/HomeTemplate/_components/AuthInitializer";

function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          {generateRoutes(routes)}
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
}

export default App;
