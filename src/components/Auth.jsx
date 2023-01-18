import { createContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import axios from "../utils/axios"
import Loader from "./Loader"

export const AuthContext = createContext()

export default function Auth() {
    const [isFetching, setIsFetching] = useState(true)
    const [currentUser, setCurrentUser] = useState()

    const fetchAccount = async () => {
        const { data } = await axios.get("/auth")
        console.log(data);
        setCurrentUser(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchAccount()
    }, [])

    if (isFetching) {
        return <Loader />
    }

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {<Outlet />}
        </AuthContext.Provider>
    )
}