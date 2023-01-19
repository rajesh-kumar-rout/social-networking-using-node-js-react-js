import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import AddPost from "../components/AddPost"
import Loader from "../components/Loader"
import Post from "../components/Post"
import axios from "../utils/axios"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"

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

        setPosts(posts.filter(post => post.id !== postId))

        setIsLoading(false)
    }

    async function handleToggleLike(postId) {
        const {data} = await axios.patch(`/posts/${postId}/toggle-like`)

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

    return (
        <div className="my-8 flex flex-col md:flex-row gap-4 justify-center mx-auto">
            <div className="space-y-4">
                <AddPost />

                {posts.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                        onDeletePost={handleDeletePost}
                        onToggleLike={handleToggleLike}
                    />
                ))}

                {posts.length === 0 && <p className="text-teal-600 font-bold text-center my-4">No Posts Found <br /> Follow people to see their post and photos</p>}
            </div>

            <div>
                <div className="bg-white border-2 border-x-0 md:border-x-2 border-gray-300 md:rounded-md w-full md:w-[350px]">
                    <p className="px-4 py-3 border-b-2 border-gray-300 text-lg font-bold text-teal-600 flex items-center gap-2">
                        Suggested For You
                    </p>

                    <div className="p-4">
                        {users.map(user => (
                            <Link 
                                key={user.id} 
                                to={`/profile/${user.id}`} 
                                className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 
                                py-3 first:pt-0 last:pb-0"
                            >
                                <img 
                                    className="rounded-full h-12 w-12 object-cover" 
                                    src={user.profileImageUrl ? user.profileImageUrl : DEFAULT_PROFILE_IMG} 
                                    alt="" 
                                />
                                <p className="font-semibold">{user.fullName}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}