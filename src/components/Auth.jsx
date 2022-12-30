import { Navigate, Outlet } from "react-router-dom"

export function Authenticated() {
    return localStorage.getItem("jwtToken") ? <Outlet/> : <Navigate to="/login" replace />
}

export function NotAuthenticated() {
    return localStorage.getItem("jwtToken") ? <Navigate to="/" replace /> : <Outlet/>
}