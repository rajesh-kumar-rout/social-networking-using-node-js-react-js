import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import AddPost from "../components/AddPost"
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
        const { data } = await axios.patch(`/posts/${postId}/toggle-like`)

        const newPosts = [...posts]

        const index = newPosts.findIndex(post => post._id === postId)

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
        <div className="home">
            <div className="home-left">
                <AddPost />

                {posts.map(post => (
                    <Post
                        key={post._id}
                        post={post}
                        onDeletePost={handleDeletePost}
                        onToggleLike={handleToggleLike}
                    />
                ))}

                {posts.length === 0 && <p className="text-teal-600 font-bold text-center my-4">No Posts Found <br /> Follow people to see their post and photos</p>}
            </div>

            {/* <div>
                <div className="bg-white border-2 border-x-0 md:border-x-2 border-gray-300 md:rounded-md w-full md:w-[350px]">
                    <p className="px-4 py-3 border-b-2 border-gray-300 text-lg font-bold text-teal-600 flex items-center gap-2">
                        Suggested For You
                    </p>

                    <div className="p-4">
                        {users.map(user => (
                            <Link
                                key={user._id}
                                to={`/profile/${user._id}`}
                                className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 
                                py-3 first:pt-0 last:pb-0"
                            >
                                <img
                                    className="rounded-full h-12 w-12 object-cover"
                                    src={user.profileImage ? user.profileImage.url : DEFAULT_PROFILE_IMG}
                                    alt=""
                                />
                                <p className="font-semibold">{fullName(user)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div> */}

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