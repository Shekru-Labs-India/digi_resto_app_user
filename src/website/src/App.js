import { Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Features from "./Components/Features";
import Pricing from "./Components/Pricing";
import Client from "./Components/Client";

function App() {
  return (
    <div className="website-wrapper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/client" element={<Client />} />
      </Routes>
    </div>
  );
}

export default App;
