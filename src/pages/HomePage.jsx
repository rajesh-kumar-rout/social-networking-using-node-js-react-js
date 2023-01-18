import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import AddPost from "../components/AddPost"
import Loader from "../components/Loader"
import Post from "../components/Post"
import axios from "../utils/axios"

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

                {posts.length === 0 && <p className="text-lg text-teal-600 font-bold text-center my-4">No Posts Found <br /> Follow people to see their post and photos</p>}
            </div>

            <div>
                <div className="bg-white border-2 border-gray-300 rounded-md w-full md:w-[350px]">
                    <p className="px-4 py-3 border-b-2 border-gray-300 text-lg font-bold text-teal-600 flex items-center gap-2">
                        Suggested For You
                    </p>

                    <div className="p-4">
                        {users.map(user => (
                            <Link key={user.id} to={`/profile/${user.id}`} className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                                <img className="rounded-full h-12 w-12 object-cover" src={user.profileImageUrl} alt="" />
                                <p className="font-semibold">{user.fullName}</p>
                            </Link>
                        ))}

                        {/* <Link to="" className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                            <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1370690627/photo/side-view-of-woman-wants-to-scream-covers-mouth-with-palm-stares-at-something-terrible.jpg?b=1&s=170667a&w=0&k=20&c=N6-Ip3xict73SOJ15F-84-Z51_ZmXvvoXwZlTBi9POg=" alt="" />
                            <p className="font-semibold">{user.name}</p>
                        </Link> */}

                        {/* <Link to="/profile/2" className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                            <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1338134336/photo/headshot-portrait-african-30s-man-smile-look-at-camera.jpg?b=1&s=170667a&w=0&k=20&c=j-oMdWCMLx5rIx-_W33o3q3aW9CiAWEvv9XrJQ3fTMU=" alt="" />
                            <p className="font-semibold">Alia Bhat</p>
                        </Link>
                        <Link to="/profile/2" className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                            <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?b=1&s=170667a&w=0&k=20&c=VEE1756TeCzYH2uPsFZ_P8H3Di2j_jw8aOT6zd7V8JY=" alt="" />
                            <p className="font-semibold">Ranbir Kapoor</p>
                        </Link>
                        <Link to="/profile/2" className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                            <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?b=1&s=170667a&w=0&k=20&c=ahypUC_KTc95VOsBkzLFZiCQ0VJwewfrSV43BOrLETM=" alt="" />
                            <p className="font-semibold">Salman Khan</p>
                        </Link>
                        <Link to="/profile/2" className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                            <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1399788030/photo/portrait-of-young-confident-indian-woman-pose-on-background.jpg?b=1&s=170667a&w=0&k=20&c=8D_YP_bxKh8CH_W3n0kKr9bzQjZeYxUv9QgqfXjHNX8=" alt="" />
                            <p className="font-semibold">Amir Khan</p>
                        </Link>
                        <Link to="/profile/2" className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                            <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?b=1&s=170667a&w=0&k=20&c=VEE1756TeCzYH2uPsFZ_P8H3Di2j_jw8aOT6zd7V8JY=" alt="" />
                            <p className="font-semibold">John Abraham</p>
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    )
}