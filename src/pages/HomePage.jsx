import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Post from "../components/Post"
import Loader from "../components/Loader"
import axios from "../utils/axios"
import { MdEdit, MdHome, MdLock, MdLogout, MdSearch } from "react-icons/md"

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function fetchPosts() {
        const { data } = await axios.get("/posts/feeds")

        setPosts(data)

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
        axios.patch(`/posts/${postId}/toggle-like`)

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
        return (
            <p
                className="flex justify-center items-center text-indigo-600 h-full text-center text-xl font-bold"
            >
                No Posts Found <br /> Follow people to see their post and photos
            </p>
        )
    }

    return (
        <div className="space-y-5 my-5 grid grid-cols-12 gap-4 max-w-6xl mx-auto">
            <div className="col-span-4">
                {/* <div className="bg-white p-4 border-2 border-gray-300 flex flex-col gap-4 text-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <MdHome size={24} className="text-gray-700 " />
                        </div>
                        <p>Home</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <MdSearch size={24} className="text-gray-700 " />
                        </div>
                        <p>Search</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <MdEdit size={24} className="text-gray-700 " />
                        </div>
                        <p>Edit Profile</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <MdLock size={24} className="text-gray-700 " />
                        </div>
                        <p>Change Password</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <MdLogout size={24} className="text-gray-700 " />
                        </div>
                        <p>Logout</p>
                    </div>
                </div> */}
                {/* <div className="bg-white border-2 border-gray-300 text-gray-700">
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Home</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Followers</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Followings</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Search</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Edit Profile</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Change Password</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Logout</a>
                </div> */}
                <div className="bg-white border-2 border-gray-300 text-gray-700">
                    <p className="px-4 py-3">
                        Suggested
                    </p>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Home</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Followers</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Followings</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Search</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Edit Profile</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Change Password</a>
                    <a href="" className="block border-t-2 border-t-gray-300 px-6 py-3 hover:bg-indigo-600 hover:text-white">Logout</a>
                </div>
            </div>
            <div className="col-span-8">
                {posts.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                        onDeletePost={handleDeletePost}
                        onToggleLike={handleToggleLike}
                    />
                ))}
            </div>
            <div className="col-span-4">

            </div>
        </div>
    )
}