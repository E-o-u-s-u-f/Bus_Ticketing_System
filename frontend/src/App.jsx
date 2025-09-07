import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./Page/AdminLogin";
import AdminRegister from "./Page/AdminRegister";
import AdminScheduleManager from "./Page/AdminScheduleManager";
import ScheduleSearch from "./Page/Schedulesearch";

export default function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <BrowserRouter>
        <Routes>
          {/* Add a default route for "/" */}
          <Route path="/" element={<Navigate to="/schedules" replace />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/schedules" element={<AdminScheduleManager />} />
          <Route path="/schedules" element={<ScheduleSearch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
