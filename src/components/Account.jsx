import { createContext, useContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Loader from "./Loader"
import axios from "../utils/axios"

export const AccountContext = createContext()

export const useAccountContext = () => useContext(AccountContext)

export default function Account() {
    const [isFetching, setIsFetching] = useState(true)
    const [account, setAccount] = useState(null)

    const fetchAccount = async () => {
        const { data } = await axios.get("/auth/account")
        setAccount(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchAccount()
    }, [])

    if (isFetching) {
        return <Loader/>
    }

    return (
        <AccountContext.Provider
            value={{
                account,
                setAccount
            }}
        >
            {<Outlet />}
        </AccountContext.Provider>
    )
}