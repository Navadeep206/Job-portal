import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";

function DashboardLayout() {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 transition-all">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
