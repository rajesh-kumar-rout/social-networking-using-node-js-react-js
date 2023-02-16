import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"

export default function Layout() {
    return (
        <div>
            <NavBar />

            <div className="layout">
                <div className="layout-container">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}