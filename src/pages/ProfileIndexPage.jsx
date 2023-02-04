import moment from "moment";
import { useEffect, useState } from "react";
import { MdFavoriteBorder, MdMale, MdOutlineCake, MdOutlineHome, MdOutlineLocationOn, MdOutlineSchool, MdSchedule, MdWorkOutline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Post from "../components/Post";
import axios from "../utils/axios";
import { fullName } from "../utils/functions";

export default function ProfileIndexPage() {
    const { userId } = useParams()
    const [user, setUser] = useState()
    const [posts, setPosts] = useState([])
    const [photos, setPhotos] = useState([])
    const [followings, setFollowings] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function fetchUser() {
        const [userRes, postsRes, photosRes, followingsRes] = await Promise.all([
            axios.get(`/users/${userId}`),
            axios.get(`/users/${userId}/posts`),
            axios.get(`/users/${userId}/photos?limit=9`),
            axios.get(`/users/${userId}/followings?limit=9`),
        ])

        setUser(userRes.data)

        setPosts(postsRes.data)

        setPhotos(photosRes.data)
console.log(photosRes.data)
        setFollowings(followingsRes.data)

        setIsLoading(false)
    }

    async function handleDeletePost(postId) {
        setIsLoading(true)

        await axios.delete(`/posts/${postId}`)

        toast.success("Post deleted successfully")

        setPosts(posts.filter(post => post._id !== postId))

        setIsLoading(false)
    }

    async function handleToggleLike(postId) {
        axios.patch(`/posts/${postId}/toggle-like`)

        const newPosts = [...posts]

        const index = posts.findIndex(post => post._id === postId)

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
        return (
            <div className="my-4">
                <Loader />
            </div>
        )
    }

    return (
        <div className="my-5 flex flex-col lg:flex-row gap-4 max-w-5xl mx-auto justify-start">
            <div className="space-y-4">
                <div className="bg-white border-2 border-x-0 md:border-x-2 border-gray-300 md:rounded-md">
                    <h2 className="text-lg font-bold border-b-2 border-gray-300 py-3 px-4 text-teal-600">Bio</h2>
                    <p className="text-gray-600 p-4">{user.bio}</p>
                </div>

                <div className="bg-white border-2 border-x-0 md:border-x-2 border-gray-300 md:rounded-md">
                    <h2 className="text-lg font-bold border-b-2 border-gray-300 py-3 px-4 text-teal-600">Intro</h2>
                    <div className="space-y-4 p-4">
                        {user.work && (
                            <div className="flex items-center gap-4 text-gray-700">
                                <MdWorkOutline size={24} />
                                <p className="text-gray-600">Works at {user.work}</p>
                            </div>
                        )}

                        {user.college && (
                            <div className="flex items-center gap-4 text-gray-700">
                                <MdOutlineSchool size={24} />
                                <p className="text-gray-600">Studies at {user.college}</p>
                            </div>
                        )}

                        {user.school && (
                            <div className="flex items-center gap-4 text-gray-700">
                                <MdOutlineSchool size={24} />
                                <p className="text-gray-600">Went to {user.school}</p>
                            </div>
                        )}

                        {user.currentCity && (
                            <div className="flex items-center gap-4 text-gray-700">
                                <MdOutlineLocationOn size={24} />
                                <p className="text-gray-600">Lives in {user.currentCity}</p>
                            </div>
                        )}

                        {user.homeTown && (
                            <div className="flex items-center gap-4 text-gray-700">
                                <MdOutlineHome size={24} />
                                <p className="text-gray-600">From {user.homeTown}</p>
                            </div>
                        )}

                        {user.relationship && (
                            <div className="flex items-center gap-4 text-gray-700">
                                <MdFavoriteBorder size={24} />
                                <p className="text-gray-600">{user.relationship}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-4 text-gray-700">
                            <MdSchedule size={24} />
                            <p className="text-gray-600">Joined on {moment(user.createdAt).format("DD MMM YYYY")}</p>
                        </div>

                        <div className="flex items-center gap-4 text-gray-700">
                            <MdMale size={24} />
                            <p className="text-gray-600">{user.gender}</p>
                        </div>

                        {user.birthDate && (
                            <div className="flex items-center gap-4 text-gray-700">
                                <MdOutlineCake size={24} />
                                <p className="text-gray-600">Birth Day - {moment(user.birthDate).format("DD MMM YYYY")}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white border-2 border-x-0 md:border-x-2 border-gray-300 md:rounded-md">
                    <h2 className="border-b-2 border-gray-300 py-3 px-4 flex justify-between items-center">
                        <p className="text-lg font-bold text-teal-600">Photos</p>
                        <Link
                            to="photos"
                            className="text-sm font-semibold text-teal-600 border border-transparent rounded-md p-1 
                            hover:border-teal-600"
                        >
                            View All
                        </Link>
                    </h2>

                    {photos.length === 0 ? (
                        <p className="text-sm text-gray-600 p-4 text-center">No Photos Found</p>
                    ) : (
                        <div className="p-4 grid grid-cols-3 gap-1">
                            {photos.map(photo => (
                                <img key={photo.image.url} className="rounded object-cover" src={photo.image.url} alt="" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white border-2 border-x-0 md:border-x-2 border-gray-300 md:rounded-md">
                    <h2 className="border-b-2 border-gray-300 py-3 px-4 flex justify-between items-center">
                        <p className="text-lg font-bold text-teal-600">Followings</p>
                        <Link
                            to="followings"
                            className="text-sm font-semibold text-teal-600 border border-transparent rounded-md p-1 
                            hover:border-teal-600"
                        >
                            View All
                        </Link>
                    </h2>

                    {followings.length === 0 ? (
                        <p className="text-sm text-gray-600 text-center p-4">No Followings Found</p>
                    ) : (
                        <div className="p-4 grid grid-cols-3 gap-x-1 gap-y-3">
                            {followings.map(following => (
                                <Link key={following._id} to={`/profile/${following._id}`}>
                                    <img className="rounded object-cover" src={following.profileImage.url} alt="" />
                                    <p className="text-xs font-semibold mt-1 text-center">{fullName(following)}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {posts.length === 0 && (
                    <p
                        className="font-bold w-full sm:w-[600px] text-center text-teal-600 bg-white border-2 border-x-0 
                        sm:border-x-2 border-gray-300 rounded-md p-4"
                    >
                        No Posts Found
                    </p>
                )}
                {posts.map(post => (
                    <Post
                        key={post._id}
                        post={post}
                        onDeletePost={handleDeletePost}
                        onToggleLike={handleToggleLike}
                    />
                ))}
            </div>
        </div>
    )
}