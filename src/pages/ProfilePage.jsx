import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Post from "../components/Post"
import Loader from "../components/Loader"
import Profile from "../components/Profile"
import axios from "../utils/axios"

export default function ProfilePage() {
    const { userId } = useParams()
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchUser = async () => {
        const [userRes, postRes] = await Promise.all([
            axios.get(`/users/${userId}`),
            axios.get(`/users/${userId}/posts`)
        ])
        setUser(userRes.data)
        setPosts(postRes.data)
        setIsLoading(false)
    }

    const handleDeletePost = async (postId) => {
        setIsLoading(true)
        await axios.delete(`/posts/${postId}`)
        toast.error("Post deleted successfully")
        setPosts(posts.filter(post => post.id !== postId))
        setIsLoading(false)
    }

    const handleToggleFollow = async () => {
        setIsLoading(true)
        await axios.patch(`/users/${user.id}/toggleFollow`)
        setUser({
            ...user,
            isFollowing: !user.isFollowing,
            totalFollowers: user.isFollowing ? (user.totalFollowers - 1) : (user.totalFollowers + 1)
        })
        setIsLoading(false)
    }

    const handleToggleLike = async (postId) => {
        axios.patch(`/posts/${postId}/toggleLike`)
        const newPosts = [...posts]
        const index = posts.findIndex(post => post.id === postId)
        newPosts[index].totalLikes = newPosts[index].isLiked ? newPosts[index].totalLikes - 1 : newPosts[index].totalLikes + 1
        newPosts[index].isLiked = !newPosts[index].isLiked
        setPosts(newPosts)
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
            <Profile user={user} onToggleFollow={handleToggleFollow}/>

            {posts.length ? (
                <div className="space-y-5 my-5">
                    {posts.map(post => (
                        <Post
                            key={post.id}
                            post={post}
                            onDeletePost={handleDeletePost}
                            onToggleLike={handleToggleLike}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-xl font-bold text-indigo-600 text-center my-5">
                    No Post Found 
                </p>
            )}
        </div>
    )
}