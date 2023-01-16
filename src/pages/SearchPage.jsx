import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from "../components/Loader"
import UserList from "../components/Users"
import axios from "../utils/axios"

export default function SearchPage() {
    const { query } = useParams()
    const [users, setUsers] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchUsers = async () => {
        const { data } = await axios.get(`/users?query=${query}`)

        setUsers(data)

        setIsFetching(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [query])

    if (isFetching) {
        return <Loader />
    }

    return (
        <div className="px-2">
            <UserList title={`${users.length} Users Found`} users={users} />
        </div>
    )
}