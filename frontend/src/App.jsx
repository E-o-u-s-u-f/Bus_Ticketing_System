import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./Page/AdminLogin";
import AdminRegister from "./Page/AdminRegister";
import AdminScheduleManager from "./Page/AdminScheduleManager";
import ScheduleSearch from "./Page/Schedulesearch";
import RouteCreate from "./Page/RouteCreate";
import BusInsert from "./Page/BusInsert";
import Home from "./Page/Home";

export default function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <BrowserRouter>
        <Routes>
          {/* Add a default route for "/" */}
          
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route  path="/home" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/schedules" element={<AdminScheduleManager />} />
          <Route path="/admin/route" element= {<RouteCreate />}/>
          <Route path="/admin/bus" element= {<BusInsert />}/>
          
          <Route path="/schedules" element={<ScheduleSearch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
