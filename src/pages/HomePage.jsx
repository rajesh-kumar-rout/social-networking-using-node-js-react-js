import { useEffect, useState } from "react"
import Post from "../components/Post"
import Loader from "../components/Loader"
import EmptyMessage from "../components/EmptyMessage"
import axios from "../utils/axios"
import { toast } from "react-toastify"

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchPosts = async () => {
        const { data } = await axios.get("/posts/feeds")
        setPosts(data)
        setIsLoading(false)
    }

    const handleDeletePost = async (postId) => {
        setIsLoading(true)

        await axios.delete(`/posts/${postId}`)
        toast.error("Post deleted successfully")
        setPosts(posts.filter(post => post.id !== postId))

        setIsLoading(false)
    }

    const handleToggleLike = async (postId) => {
        axios.patch(`/posts/${postId}/toggleLike`)
        const newPosts = [...posts]
        const index = newPosts.findIndex(post => post.id === postId)
        newPosts[index].totalLikes = newPosts[index].isLiked ? newPosts[index].totalLikes - 1 : newPosts[index].totalLikes + 1
        newPosts[index].isLiked = !newPosts[index].isLiked
        setPosts(newPosts)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    if (isLoading) {
        return <Loader />
    }

    if (posts.length === 0) {
        return <EmptyMessage message="No Posts Found. Follow people to see their post and photos" />
    }

    return (
        <div className="posts my-4">
            {posts.map(post => (
                <Post
                    key={post.id}
                    post={post}
                    onDeletePost={handleDeletePost}
                    onToggleLike={handleToggleLike}
                />
            ))}
        </div>
    )
}