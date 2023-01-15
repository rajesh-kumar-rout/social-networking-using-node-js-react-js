import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import UserList from "../components/Users"
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
        <div className="px-2">
            {/* <div className="bg-white flex items-center max-w-2xl mx-auto gap-3 p-4 border-2 rounded-md border-gray-300 my-8">
                <MdSearch size={28} />

                <input
                    type="search"
                    className="w-full outline-none"
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search Here..."
                />
            </div> */}

            {filteredUsers.length === 0 ? (
                <p className="text-xl text-center font-bold text-indigo-600">There is no user as "{query}"</p>
            ) : (
                <UserList
                    title={`${filteredUsers.length} Users Found`}
                    users={filteredUsers}
                />
            )}
        </div>
    )
}