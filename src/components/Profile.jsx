import { useContext } from "react"
import { Link, useParams } from "react-router-dom"
import { DEFAULT_COVER_IMG, DEFAULT_PROFILE_IMG } from "../utils/constants"
import { postImgUrl } from "../utils/functions"
import { AuthContext } from "./Auth"

export default function Profile({ user, onToggleFollow }) {
    const { userId } = useParams()
    const { currentUser } = useContext(AuthContext)

    return (
        <div className="bg-white shadow-md pb-8">
            <div className="mx-auto max-w-[1000px]">
                <img
                    src={user.coverImgUrl ? user.coverImgUrl : DEFAULT_COVER_IMG}
                    className="rounded-b-md object-cover w-full"
                    style={{ height: 350 }}
                />

                <div
                    className="flex flex-col lg:flex-row items-center lg:items-end gap-4 relative bottom-20 lg:bottom-14 -mb-20 
                    lg:-mb-14 lg:pl-10"
                >
                    <img
                        src={user.profileImgUrl ? postImgUrl(user.profileImgUrl) : DEFAULT_PROFILE_IMG}
                        className="h-40 w-40 object-cover rounded-md border-white border-2"
                    />

                    <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between flex-1">
                        <div>
                            <p className="text-center lg:text-start text-2xl font-bold mb-2">{user.name}</p>
                            <p className="flex items-center gap-3 text-gray-700 mb-3 lg:mb-0">
                                {user.totalFollowers} Followers • {user.totalFollowings} Followings • {user.totalPosts} Posts
                            </p>
                        </div>

                        {userId == currentUser.id ? (
                            <Link to="/edit-account" className="btn btn-primary">
                                Edit Account
                            </Link>
                        ) : (
                            <button className="btn btn-primary" onClick={onToggleFollow}>
                                {user.isFollowing ? "Un Follow" : "Follow"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}