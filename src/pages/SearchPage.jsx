import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Loader from "../components/Loader"
import UserList from "../components/Users"
import axios from "../utils/axios"
import { MdSearch } from "react-icons/md"

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query")
    const [users, setUsers] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchUsers = async () => {
        const { data } = await axios.get(`/users?search=${query}`)

        setUsers(data)

        setIsFetching(false)
    }

    useEffect(() => {
        setUsers([])
        setIsFetching(true)
        fetchUsers()
    }, [query])

    if (isFetching) {
        return <Loader />
    }

    return (
        <div>
            <div className="search-box">
                <MdSearch size={24}/>
                <input type="search" placeholder="Search people here..."/>
            </div>
            <UserList title={`${users.length} Users Found`} users={users} />
        </div>
    )
}