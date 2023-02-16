import { useContext, useEffect, useState } from "react"
import { Link, Outlet, useParams } from "react-router-dom"
import { AuthContext } from "../components/Auth"
import Image from "../components/Image"
import Loader from "../components/Loader"
import axios from "../utils/axios"
import { DEFAULT_COVER_IMG, DEFAULT_PROFILE_IMG } from "../utils/constants"
import { cloudiImgUrl, fullName } from "../utils/functions"

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
        console.log(userRes.data);
        setUser(userRes.data)

        setPosts(postRes.data)

        setIsLoading(false)
    }

    async function handleToggleFollow() {
        setIsLoading(true)

        await axios.patch(`/users/${user._id}/toggle-follow`)

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
        <div style={{maxWidth: 1200}}>
            <div className="profile">
                <Image src={user.coverImage.url} alt={DEFAULT_PROFILE_IMG} className="profile-cover-img"/>

                <div className="profile-footer">
                    <Image src={user.profileImage.url} alt={DEFAULT_PROFILE_IMG} className="profile-img"/>

                    <div className="profile-right">
                        <div>
                            <p className="profile-name">{fullName(user)}</p>
                            <p className="profile-info">
                                {user.totalFollowers} Followers • {user.totalFollowings} Followings • {user.totalPosts} Posts
                            </p>
                        </div>

                        {userId == currentUser._id ? (
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

            <Outlet />
        </div>
    )
}