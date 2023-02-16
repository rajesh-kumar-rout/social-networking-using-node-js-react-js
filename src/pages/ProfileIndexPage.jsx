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
        <div className="index">
            <div className="index-col">
                <div className="card">
                    <h2 className="card-header card-title">Bio</h2>
                    <p className="card-body">{user.bio}</p>
                </div>

                <div className="card">
                    <h2 className="card-header card-title">Intro</h2>
                    <div className="card-body index-intro">
                        {user.work && (
                            <div className="index-intro-item">
                                <MdWorkOutline size={24} />
                                <p className="index-intro-text">Works at {user.work}</p>
                            </div>
                        )}

                        {user.college && (
                            <div className="index-intro-item">
                                <MdOutlineSchool size={24} />
                                <p className="index-intro-text">Studies at {user.college}</p>
                            </div>
                        )}

                        {user.school && (
                            <div className="index-intro-item">
                                <MdOutlineSchool size={24} />
                                <p className="index-intro-text">Went to {user.school}</p>
                            </div>
                        )}

                        {user.currentCity && (
                            <div className="index-intro-item">
                                <MdOutlineLocationOn size={24} />
                                <p className="index-intro-text">Lives in {user.currentCity}</p>
                            </div>
                        )}

                        {user.homeTown && (
                            <div className="index-intro-item">
                                <MdOutlineHome size={24} />
                                <p className="index-intro-text">From {user.homeTown}</p>
                            </div>
                        )}

                        {user.relationship && (
                            <div className="index-intro-item">
                                <MdFavoriteBorder size={24} />
                                <p className="index-intro-text">{user.relationship}</p>
                            </div>
                        )}

                        <div className="index-intro-item">
                            <MdSchedule size={24} />
                            <p className="index-intro-text">Joined on {moment(user.createdAt).format("DD MMM YYYY")}</p>
                        </div>

                        <div className="index-intro-item">
                            <MdMale size={24} />
                            <p className="index-intro-text">{user.gender}</p>
                        </div>

                        {user.birthDate && (
                            <div className="index-intro-item">
                                <MdOutlineCake size={24} />
                                <p className="index-intro-text">Birth Day - {moment(user.birthDate).format("DD MMM YYYY")}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h2 className="card-header index-header">
                        <p className="card-title">Photos</p>
                        <Link
                            to="photos"
                            className="index-link"
                        >
                            View All
                        </Link>
                    </h2>

                    {photos.length === 0 ? (
                        <p className="card-body">No Photos Found</p>
                    ) : (
                        <div className="card-body index-photos">
                            {photos.map(photo => (
                                <img key={photo.image.url} src={photo.image.url} alt="" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="card">
                    <h2 className="card-header index-header">
                        <p className="card-title">Followings</p>
                        <Link
                            to="followings"
                            className="index-link"
                        >
                            View All
                        </Link>
                    </h2>

                    {followings.length === 0 ? (
                        <p className="card-body">No Followings Found</p>
                    ) : (
                        <div className="card-body index-followings">
                            {followings.map(following => (
                                <Link key={following._id} to={`/profile/${following._id}`}>
                                    <img src={following.profileImage.url} alt="" />
                                    <p className="index-following-name">{fullName(following)}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="index-col">
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