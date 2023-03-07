import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Loader from "../components/Loader"
import UserList from "../components/Users"
import axios from "../utils/axios"
import { MdSearch } from "react-icons/md"

export default function SearchPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query")
    const [users, setUsers] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchUsers = async () => {
        const { data } = await axios.get(`/users?query=${query}`)

        setUsers(data)

        setIsFetching(false)
    }

    const handleSubmit = event => {
        event.preventDefault()
        navigate(`/search?query=${event.target.query.value}`)
    }

    useEffect(() => {
        setUsers([])
        setIsFetching(true)
        fetchUsers()
    }, [query])

    return (
        <div>
            <form className="search-box" onSubmit={handleSubmit}>
                <input type="search" className="search-box-input form-control" defaultValue={query} name="query" placeholder="Search people here..." />
                <button className="search-box-btn">
                    <MdSearch size={24}/>
                </button>
            </form>
            {isFetching ? (<Loader />) : <UserList title={`${users.length} Users Found`} users={users} />}
        </div>
    )
}