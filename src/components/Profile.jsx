import { useContext } from "react"
import { Link, useParams } from "react-router-dom"
import { postImgUrl } from "../utils/functions"
import { AccountContext } from "./Account"

export default function Profile({ user, onToggleFollow }) {
    const { userId } = useParams()
    const { account } = useContext(AccountContext)

    return (
        <div className="profile">
            <div className="profile-container">
                <img src={user.coverImgUrl} className="profile-banner-img" />

                <div className="profile-info">
                    <img src={postImgUrl(user.profileImgUrl)} className="profile-img" />

                    <div className="profile-right">
                        <div className="profile-summary">
                            <p className="profile-username">{user.name}</p>
                            <p className="profile-statistic">
                                {user.totalFollowers} Followers • {user.totalFollowings} Followings • {user.totalPosts} Posts
                            </p>
                        </div>

                        {userId == account.id ? (
                            <Link to="/edit-account" className="btn btn-primary">Edit Account</Link>
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