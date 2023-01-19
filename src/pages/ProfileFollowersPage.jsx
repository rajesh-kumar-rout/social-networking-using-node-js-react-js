import { useEffect, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "../utils/axios"

export default function ProfileFollowersPage() {
    const navigate = useNavigate()
    const { userId } = useParams()
    const [followings, setFollowings] = useState([])

    async function fetchFollowings() {
        const { data } = await axios.get(`/users/${userId}/followings`)
        setFollowings(data)
    }

    useEffect(() => {
        fetchFollowings()
    }, [])

    return (
        <div className="bg-white border-2 border-x-0 sm:border-x-2 border-gray-300 sm:rounded-md max-w-xl mx-auto my-8">
            <p className="px-4 py-3 border-b-2 border-gray-300 text-lg font-bold text-teal-600 flex items-center gap-2">
                <MdArrowBack size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
                All Followings
            </p>

            {followings.length === 0 ? (
                <p className="text-sm text-gray-600 p-4 text-center">No Followings Found</p>
            ) : (
                <div className="p-4">
                    {followings.map(following => (
                        <Link
                            key={following.id}
                            to={`/profile/${following.id}`}
                            className="flex items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 
                            last:pb-0"
                        >
                            <img className="rounded-full h-12 w-12 object-cover" src={following.profileImageUrl} alt="" />
                            <p className="font-semibold">{following.fullName}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}