import { useContext, useEffect, useState } from "react"
import { Link, Outlet, useParams } from "react-router-dom"
import { AuthContext } from "../components/Auth"
import Loader from "../components/Loader"
import axios from "../utils/axios"
import { DEFAULT_COVER_IMG, DEFAULT_PROFILE_IMG } from "../utils/constants"
import { postImgUrl } from "../utils/functions"

export default function ProfilePage() {
    const { userId } = useParams()
    const { currentUser } = useContext(AuthContext)
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function fetchUser() {
        const [userRes, postRes] = await Promise.all([
            axios.get(`/users/${userId}`),
            axios.get(`/users/${userId}/posts`)
        ])

        setUser(userRes.data)

        setPosts(postRes.data)

        setIsLoading(false)
    }

    async function handleToggleFollow() {
        setIsLoading(true)

        await axios.patch(`/users/${user.id}/toggle-follow`)

        setUser({
            ...user,
            isFollowing: !user.isFollowing,
            totalFollowers: user.isFollowing ? (user.totalFollowers - 1) : (user.totalFollowers + 1)
        })

        setIsLoading(false)
    }

    useEffect(() => {
        setIsLoading(true)
        setUser(null)
        setPosts([])
        fetchUser()
    }, [userId])

    if (isLoading) {
        return <Loader />
    }

    return (
        <div>
            <div className="bg-white border-b-2 border-gray-300 pb-8">
                <div className="mx-auto max-w-[1000px]">
                    <img
                        src={user.coverImageUrl ? user.coverImageUrl : DEFAULT_COVER_IMG}
                        className="rounded-b-md object-cover w-full"
                        style={{ height: 350 }}
                    />

                    <div
                        className="flex flex-col lg:flex-row items-center lg:items-end gap-4 relative bottom-20 lg:bottom-14 
                        -mb-20 lg:-mb-14 lg:pl-10"
                    >
                        <img
                            src={user.profileImageUrl ? postImgUrl(user.profileImageUrl) : DEFAULT_PROFILE_IMG}
                            className="h-40 w-40 object-cover rounded-md border-white border-2"
                        />

                        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between flex-1">
                            <div>
                                <p className="text-center lg:text-start text-2xl font-bold mb-2">{user.fullName}</p>
                                <p className="flex items-center gap-3 text-gray-700 mb-3 lg:mb-0">
                                    {user.totalFollowers} Followers • {user.totalFollowings} Followings • {user.totalPosts} Posts
                                </p>
                            </div>

                            {userId == currentUser.id ? (
                                <Link to="/auth/edit-profile" className="btn btn-primary">
                                    Update Profile
                                </Link>
                            ) : (
                                <button className="btn btn-primary" onClick={handleToggleFollow}>
                                    {user.isFollowing ? "Un Follow" : "Follow"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    )
}