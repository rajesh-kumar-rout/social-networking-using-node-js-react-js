import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../components/Account"
import UserList from "../components/UserList"
import Loader from "../components/Loader"
import EmptyMessage from "../components/EmptyMessage"
import axios from "../utils/axios"

export default function FollowingsPage() {
    const { account } = useContext(AccountContext)
    const [users, setUsers] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchFollowings = async () => {
        const { data } = await axios.get(`/users/${account.id}/followings`)
        setUsers(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchFollowings()
    }, [])

    if (isFetching) {
        return <Loader />
    }

    if (!users.length) {
        return <EmptyMessage message="You have not follow any people yet" />
    }

    return (
        <UserList
            title={users.length + " Followings Found"}
            users={users}
        />
    )
}