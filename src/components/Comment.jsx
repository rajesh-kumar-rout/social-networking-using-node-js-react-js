import { useContext } from "react"
import { dateToAgo, fullName } from "../utils/functions"
import { AuthContext } from "./Auth"
import Image from "./Image"

export default function Comment({ comment, onDeleteComment }) {
    const { currentUser } = useContext(AuthContext)

    return (
        <div className="comment">
            <Image className="comment-img" src={comment.user.profileImage?.url} alt={process.env.REACT_APP_DEFAULT_PROFILE_IMG}/>

            <div className="comment-right">
                <div className="comment-header">
                    <h4 className="comment-username">{fullName(comment.user)}</h4>
                    <p className="comment-created-at">{dateToAgo(comment.createdAt)}</p>
                </div>

                <p className="comment-text">{comment.comment}</p>

                {comment.user._id === currentUser._id && (
                    <button onClick={() => onDeleteComment(comment._id)} style={{ marginTop: 12 }} className="btn btn-sm btn-primary">Delete</button>
                )}
            </div>
        </div>
    )
}