import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "./Auth"

export default function UnAuthenticated() {
    const { currentUser } = useContext(AuthContext)

    return currentUser ? <Navigate to="/" replace /> : <Outlet/>
}