import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../components/Auth"
import UserList from "../components/Users"
import Loader from "../components/Loader"
import EmptyMessage from "../components/EmptyMessage"
import axios from "../utils/axios"

export default function FollowersPage() {
    const { currentUser } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchFollowers = async () => {
        const { data } = await axios.get(`/users/${currentUser.id}/followers`)
        setUsers(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchFollowers()
    }, [])

    if (isFetching) {
        return <Loader />
    }

    if (!users.length) {
        return <EmptyMessage message="No one has follow you yet"/>
    }

    return (
        <UserList
            title={`${users.length} Followers Found`}
            users={users}
        />
    )
}