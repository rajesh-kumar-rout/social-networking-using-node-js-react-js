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
        <div className="bg-white border-2 border-gray-300 rounded-md max-w-xl mx-auto my-8">
            <p className="px-4 py-3 border-b-2 border-gray-300 text-lg font-bold text-teal-600 flex items-center gap-2">
                <MdArrowBack size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
                All Followings
            </p>

            <div className="p-4">
            {followings.length === 0 && <p className="text-sm text-gray-600">No Followings Found</p>}
                {followings.map(following => (
                    <Link key={following.id} to={`/profile/${following.id}`} className="flex items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                        <img className="rounded-full h-12 w-12 object-cover" src={following.profileImageUrl} alt="" />
                        <p className="font-semibold">{following.fullName}</p>
                    </Link>
                ))}
                {/* <div className="flex items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                    <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1338134336/photo/headshot-portrait-african-30s-man-smile-look-at-camera.jpg?b=1&s=170667a&w=0&k=20&c=j-oMdWCMLx5rIx-_W33o3q3aW9CiAWEvv9XrJQ3fTMU=" alt="" />
                    <p className="font-semibold">Alia Bhat</p>
                </div>
                <div className="flex items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                    <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?b=1&s=170667a&w=0&k=20&c=VEE1756TeCzYH2uPsFZ_P8H3Di2j_jw8aOT6zd7V8JY=" alt="" />
                    <p className="font-semibold">Ranbir Kapoor</p>
                </div>
                <div className="flex items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                    <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.jpg?b=1&s=170667a&w=0&k=20&c=ahypUC_KTc95VOsBkzLFZiCQ0VJwewfrSV43BOrLETM=" alt="" />
                    <p className="font-semibold">Salman Khan</p>
                </div>
                <div className="flex items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                    <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1399788030/photo/portrait-of-young-confident-indian-woman-pose-on-background.jpg?b=1&s=170667a&w=0&k=20&c=8D_YP_bxKh8CH_W3n0kKr9bzQjZeYxUv9QgqfXjHNX8=" alt="" />
                    <p className="font-semibold">Amir Khan</p>
                </div>
                <div className="flex items-center gap-4 border-t-2 border-gray-300 first:border-t-0 py-3 first:pt-0 last:pb-0">
                    <img className="rounded-full h-12 w-12 object-cover" src="https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?b=1&s=170667a&w=0&k=20&c=VEE1756TeCzYH2uPsFZ_P8H3Di2j_jw8aOT6zd7V8JY=" alt="" />
                    <p className="font-semibold">John Abraham</p>
                </div> */}
            </div>
        </div>
    )
}