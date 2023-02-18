import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import AddPost from "../components/AddPost"
import EmptyMessage from "../components/EmptyMessage"
import Loader from "../components/Loader"
import Post from "../components/Post"
import axios from "../utils/axios"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { fullName } from "../utils/functions"

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function fetchPosts() {
        const [postsRes, usersRes] = await Promise.all([
            axios.get("/posts/feeds"),
            axios.get("/users/me/suggested")
        ])

        setPosts(postsRes.data)

        setUsers(usersRes.data)

        setIsLoading(false)
    }

    async function handleDeletePost(postId) {
        setIsLoading(true)

        await axios.delete(`/posts/${postId}`)

        toast.error("Post deleted successfully")

        setPosts(posts.filter(post => post._id !== postId))

        setIsLoading(false)
    }

    async function handleToggleLike(postId) {
        axios.patch(`/posts/${postId}/toggle-like`)

        const newPosts = [...posts]

        const index = newPosts.findIndex(post => post._id === postId)

        newPosts[index].totalLikes = newPosts[index].isLiked ? newPosts[index].totalLikes - 1 : newPosts[index].totalLikes + 1

        newPosts[index].isLiked = !newPosts[index].isLiked

        setPosts(newPosts)
    }

    useEffect(() => {
        fetchPosts()

    }, [])

    const handleAddPost = async(values, {setSubmitting, resetForm}) => {
        setSubmitting(true)

        await axios.post("/posts", values)

        resetForm()

        setSubmitting(false)

        toast.success("Post created successfully")

        fetchPosts()
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="home">
            <div className="home-left">
                <AddPost onAddPost={handleAddPost}/>

                {posts.map(post => (
                    <Post
                        key={post._id}
                        post={post}
                        onDeletePost={handleDeletePost}
                        onToggleLike={handleToggleLike}
                    />
                ))}

                {posts.length === 0 && <EmptyMessage message="No Posts Found. Follow people to see their post and photos"/>}
            </div>

            <div className="card">
                <div className="card-header card-title">Suggested For You</div>

                <div className="card-body">
                    {users.map(user => (
                        <Link key={user._id} to={`/profile/${user._id}`} className="suggested">
                            <img
                                className="suggested-img"
                                src={user.profileImage ? user.profileImage.url : DEFAULT_PROFILE_IMG}
                            />
                            <p className="suggested-name">{fullName(user)}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}