import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import UserList from "../components/UserList"
import axios from "../utils/axios"
import { MdSearch } from "react-icons/md"

export default function SearchPage() {
    const [users, setUsers] = useState([])
    const [isFetching, setIssFetching] = useState(true)
    const [query, setQuery] = useState("")
    const [filteredUsers, setFilteredUsers] = useState([])

    const fetchUsers = async () => {
        const { data } = await axios.get("/users")
        setUsers(data)
        setIssFetching(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(query.toLocaleLowerCase())))
    }, [query, users])

    if (isFetching) {
        return <Loader />
    }

    return (
        <div className="search">
            <div className="card search-form">
                <MdSearch size={28} />

                <input
                    type="search"
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search Here..."
                />
            </div>

            {filteredUsers.length === 0 ? (
                <p className="search-no-user">There is no user as "{query}"</p>
            ) : (
                <UserList
                    title={filteredUsers.length + " Users Found"}
                    users={filteredUsers}
                />
            )}
        </div>
    )
}