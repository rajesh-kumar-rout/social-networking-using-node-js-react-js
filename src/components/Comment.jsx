import { MdDeleteOutline } from "react-icons/md"
import { dateToAgo } from "../utils/functions"

export default function Comment({ comment, onDeleteComment }) {
    return (
        <div className="comment">
            <img src={comment.profileImgUrl} className="comment-profile-img" />

            <div className="comment-right-section">
                <div>
                    <p className="comment-username">
                        {comment.userName}
                        <span className="comment-commented-at"> • {dateToAgo(comment.createdAt)}</span>
                    </p>
                    <p className="comment-comment">{comment.comment}</p>
                </div>

                {comment.isCommented === 1 && (
                    <div className="comment-btn" onClick={() => onDeleteComment(comment.id)}>
                        <MdDeleteOutline size={20} />
                    </div>
                )}
            </div>
        </div>
    )
}