import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from "./Footer"

export default function Layout() {
    return (
        <div>
            <NavBar />

            <div className="mt-20 bg-gray-200 overflow-y-auto" style={{height: 'calc(100vh - 144px)'}}>
                <Outlet />
            </div>
            
            <Footer/>
        </div>
    )
}