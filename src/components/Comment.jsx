import { useContext } from "react"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { dateToAgo, fullName } from "../utils/functions"
import { AuthContext } from "./Auth"
import Image from "./Image"

export default function Comment({ comment, onDeleteComment }) {
    const { currentUser } = useContext(AuthContext)

    return (
        <div className="comment">
            <div className="comment-header">
                <Image src={comment.user.profileImage.url}  alt={DEFAULT_PROFILE_IMG} className="comment-img"/>

                <div className="comment-header-right">
                    <span className="comment-username">{fullName(comment.user)}</span>
                    <span className="comment-created-at">{dateToAgo(comment.createdAt)}</span>
                </div>
            </div>

            <p className="comment-content">{comment.comment}</p>

            {comment.user._id === currentUser._id && (
                <div className="comment-footer">
                    <button className="btn btn-sm btn-primary" onClick={() => onDeleteComment(comment._id)}>Delete</button>
                </div>
            )}
        </div>
    )
}