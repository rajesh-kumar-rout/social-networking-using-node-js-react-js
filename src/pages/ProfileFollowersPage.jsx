import { useEffect, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { Link, useNavigate, useParams } from "react-router-dom"
import Loader from "../components/Loader"
import axios from "../utils/axios"
import { fullName } from "../utils/functions"

export default function ProfileFollowersPage() {
    const navigate = useNavigate()
    const { userId } = useParams()
    const [isFetching, setIsFetching] = useState(true)
    const [followings, setFollowings] = useState([])

    async function fetchFollowings() {
        const { data } = await axios.get(`/users/${userId}/followings`)
        setFollowings(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchFollowings()
    }, [])

    return (
        <div className="card" style={{ maxWidth: 700, margin: "24px auto 0px" }}>
            <p className="card-header card-title profile-back-nav">
                <button onClick={() => navigate(-1)} >
                    <MdArrowBack size={24} />
                </button>
                All Followings
            </p>

            {isFetching ? (
                <div className="card-body">
                    <Loader />
                </div>
            ) : (
                followings.length === 0 ? (
                    <p className="card-body" style={{ textAlign: "center" }}>No Followings Found</p>
                ) : (
                    <div className="card-body">
                        {followings.map(following => (
                            <Link key={following.id} to={`/profile/${following._id}`} className="suggested">
                                <img className="suggested-img" src={following.profileImage.url} />
                                <p className="suggested-name">{fullName(following)}</p>
                            </Link>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}