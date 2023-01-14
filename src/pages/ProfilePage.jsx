import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Post from "../components/Post"
import Loader from "../components/Loader"
import Profile from "../components/Profile"
import axios from "../utils/axios"
import { MdBook, MdCake, MdFavorite, MdHome, MdLocationCity, MdLockClock, MdMale, MdOutlineSchool, MdOutlineWork, MdSchool, MdWork } from "react-icons/md"

export default function ProfilePage() {
    const { userId } = useParams()
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

    async function handleDeletePost(postId) {
        setIsLoading(true)

        await axios.delete(`/posts/${postId}`)

        toast.success("Post deleted successfully")

        setPosts(posts.filter(post => post.id !== postId))

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

    async function handleToggleLike(postId) {
        axios.patch(`/posts/${postId}/toggle-like`)

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
            <Profile user={user} onToggleFollow={handleToggleFollow} />

            {posts.length ? (
                <div className="space-y-5 my-5 flex gap-4 max-w-5xl mx-auto justify-start">
                    <div className="col-span-4 space-y-4">

                        <div className="bg-white border-2 border-gray-300 rounded-md">
                            <h2 className="text-lg font-bold border-b-2 border-gray-300 py-3 px-4 text-teal-600">Bio</h2>
                            <p className="text-gray-600 p-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus recusandae impedit consequuntur temporibus, itaque magnam.</p>

                        </div>


                        <div className="bg-white border-2 border-gray-300 rounded-md">
                            <h2 className="text-lg font-bold border-b-2 border-gray-300 py-3 px-4 text-teal-600">Intro</h2>
                            <div className="space-y-4 p-4">
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdOutlineWork size={24} />
                                    <p className="text-gray-600">Works at Not Yet Working Iam Still Studying</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdSchool size={24} />
                                    <p className="text-gray-600">Studies at N.c autonomous college,jajpur,orissa</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdOutlineSchool size={24} />
                                    <p className="text-gray-600">Studied at gurukul kalinga +2sc. residensial college</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdLocationCity size={24} />
                                    <p className="text-gray-600">
                                        Lives in Bangalore, India</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdHome size={24} />
                                    <p className="text-gray-600">From Jajpur, Odisha</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdFavorite size={24} />
                                    <p className="text-gray-600">Single</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdLockClock size={24} />
                                    <p className="text-gray-600">Joined on June 2016</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdLockClock size={24} />
                                    <p className="text-gray-600">Joined on June 2016</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdMale size={24} />
                                    <p className="text-gray-600">Male</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <MdCake size={24} />
                                    <p className="text-gray-600">Birth Day - 2 Jan 2022</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-gray-300 rounded-md">
                            <h2 className="border-b-2 border-gray-300 py-3 px-4 flex justify-between items-center">
                                <p className="text-lg font-bold text-teal-600">Photos</p>
                                <a href="" className="text-sm font-semibold text-teal-600 border border-transparent rounded-md p-1 hover:border-teal-600 ">View All</a>
                            </h2>

                            <div className="p-4 grid grid-cols-3 gap-1">
                                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                            </div>
                        </div>
                        <div className="bg-white border-2 border-gray-300 rounded-md">
                            <h2 className="border-b-2 border-gray-300 py-3 px-4 flex justify-between items-center">
                                <p className="text-lg font-bold text-teal-600">Followings</p>
                                <a href="" className="text-sm font-semibold text-teal-600 hover:underline">View All</a>
                            </h2>

                            <div className="p-4 grid grid-cols-3 gap-x-1 gap-y-3">
                                <div>
                                    <img className="rounded object-cover" src="https://media.istockphoto.com/id/1370690627/photo/side-view-of-woman-wants-to-scream-covers-mouth-with-palm-stares-at-something-terrible.jpg?b=1&s=170667a&w=0&k=20&c=N6-Ip3xict73SOJ15F-84-Z51_ZmXvvoXwZlTBi9POg=" alt="" />
                                    <p className="text-xs font-semibold mt-1 text-center">Rajan Singh</p>
                                </div>
                                <div>
                                    <img className="rounded object-cover" src="https://media.istockphoto.com/id/1338134336/photo/headshot-portrait-african-30s-man-smile-look-at-camera.jpg?b=1&s=170667a&w=0&k=20&c=j-oMdWCMLx5rIx-_W33o3q3aW9CiAWEvv9XrJQ3fTMU=" alt="" />
                                    <p className="text-xs font-semibold mt-1 text-center">Alia Bhat</p>
                                </div>
                                <div>
                                    <img className="rounded object-cover" src="https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?b=1&s=170667a&w=0&k=20&c=VEE1756TeCzYH2uPsFZ_P8H3Di2j_jw8aOT6zd7V8JY=" alt="" />
                                    <p className="text-xs font-semibold mt-1 text-center">Ranbir Kapoor</p>
                                </div>
                                <div>
                                    <img className="rounded object-cover" src="https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?b=1&s=170667a&w=0&k=20&c=ahypUC_KTc95VOsBkzLFZiCQ0VJwewfrSV43BOrLETM=" alt="" />
                                    <p className="text-xs font-semibold mt-1 text-center">Salman Khan</p>
                                </div>
                                <div>
                                    <img className="rounded object-cover" src="https://media.istockphoto.com/id/1399788030/photo/portrait-of-young-confident-indian-woman-pose-on-background.jpg?b=1&s=170667a&w=0&k=20&c=8D_YP_bxKh8CH_W3n0kKr9bzQjZeYxUv9QgqfXjHNX8=" alt="" />
                                    <p className="text-xs font-semibold mt-1 text-center">Amir Khan</p>
                                </div>
                                <div>
                                    <img className="rounded object-cover" src="https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?b=1&s=170667a&w=0&k=20&c=VEE1756TeCzYH2uPsFZ_P8H3Di2j_jw8aOT6zd7V8JY=" alt="" />
                                    <p className="text-xs font-semibold mt-1 text-center">John Abraham</p>
                                </div>
                            </div>
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
                </div>
            ) : (
                <p className="text-xl font-bold text-teal-600 text-center my-5">
                    No Post Found
                </p>
            )}
        </div>
    )
}