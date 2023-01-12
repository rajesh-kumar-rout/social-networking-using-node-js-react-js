import { useContext } from "react"
import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom"
import { AuthContext } from "./Auth"

export default function Authenticated() {
    const { currentUser } = useContext(AuthContext)

    const [searchParams] = useSearchParams()

    const navigator = useLocation()

    let path = navigator.pathname + "?"

    searchParams.forEach((value, key) => path += `${key}=${value}`)

    path = `/login?returnUrl=${path}`

    return currentUser ? <Outlet /> : <Navigate to={path} replace />
}
