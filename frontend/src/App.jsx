import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Search from "./Pages/search";
import Navbar from "./Components/navbar";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}