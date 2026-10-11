import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

function App() {
  return (
    <div className="p-8 bg-black-100">
      <h1 className="text-3xl font-bold text-blue-600">Tailwind works!</h1>
      <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
        Test button
      </button>
    </div>
  );
}

export default App;
