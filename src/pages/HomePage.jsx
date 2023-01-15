import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import Post from "../components/Post"
import Loader from "../components/Loader"
import axios from "../utils/axios"
import { MdClose, MdEdit, MdHome, MdLock, MdLogout, MdSearch } from "react-icons/md"
import { Link } from "react-router-dom"

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [img, setImg] = useState("")
    const imgRef = useRef()
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
        <div className="space-y-5 my-8 flex lg:gap-4 justify-center mx-auto">

            <div className="lg:col-span-8">
                <div className="bg-white border-2 border-x-0 post:border-x-2 border-gray-300 rounded-md w-full post:w-[600px] mx-auto mb-6 p-4">
                    <div className="flex gap-3">
                        <img className="w-10 h-10 object-cover rounded-full" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674375/ytm0vtt148wl59sfqeqk.jpg" alt="" />

                        <div className="flex-1">
                            <textarea className="bg-gray-100 resize-none h-20 text-start border-2 focus:ring-2 focus:ring-teal-600 outline-none 
                        border-gray-300 p-2 rounded-md text-gray-800 w-full" placeholder="What's on your mind, Rajesh?" />

                            {img && (
                                <div className="relative mt-2 h-36 w-36">
                                    <img className="rounded-md object-cover w-full h-full" src={URL.createObjectURL(img)} alt="" />
                                    <button onClick={() => {
                                        setImg("")
                                        imgRef.current.value = ""
                                    }} className="bg-black absolute top-2 right-2 bg-opacity-60 rounded-full p-2 text-white">
                                        <MdClose size={24} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <input type="file" ref={imgRef} className="hidden" name="img" id="img" onChange={e => setImg(e.target.files[0])} />

                    <div className="border-t-2 border-t-gray-200 flex items-center gap-2 mt-4 pt-4 justify-end">
                        <button className="px-2 py-1 transition-all duration-300 hover:bg-green-800 focus:ring-2 focus:ring-offset-2 focus:ring-green-600 rounded bg-green-600 text-white font-semibold text-sm">
                            <label htmlFor="img" className="cursor-pointer">Add Photo</label>
                        </button>
                        <button className="px-2 py-1 transition-all duration-300 hover:bg-indigo-800 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 rounded bg-indigo-600 text-white font-semibold text-sm">Save</button>
                    </div>
                </div>

                {posts.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                        onDeletePost={handleDeletePost}
                        onToggleLike={handleToggleLike}
                    />
                ))}
            </div>
            <div className="lg:col-span-4">
                <div className="bg-white border-2 border-gray-300 rounded-md w-[350px] hidden lg:block">
                    <p className="px-4 py-3 border-b-2 border-gray-300 text-lg font-bold text-teal-600 flex items-center gap-2">
                        Suggested For You
                    </p>

                    <div className="p-4">
                        <Link to="/profile/2" className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                            <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1370690627/photo/side-view-of-woman-wants-to-scream-covers-mouth-with-palm-stares-at-something-terrible.jpg?b=1&s=170667a&w=0&k=20&c=N6-Ip3xict73SOJ15F-84-Z51_ZmXvvoXwZlTBi9POg=" alt="" />
                            <p className="font-semibold">Rajan Singh</p>
                        </Link>
                        <Link to="/profile/2" className="flex cursor-pointer items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
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
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}