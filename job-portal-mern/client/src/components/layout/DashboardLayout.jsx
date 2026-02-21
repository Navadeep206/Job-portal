import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";

function DashboardLayout() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div
                style={{
                    flex: 1,
                    marginLeft: 256, /* w-64 */
                    minHeight: '100vh',
                    background: 'linear-gradient(160deg, #f0f6ff 0%, #eef2ff 35%, #faf5ff 65%, #f0fdf4 100%)',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
