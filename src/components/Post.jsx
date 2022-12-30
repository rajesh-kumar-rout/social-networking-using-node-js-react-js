import { useState } from "react"
import { dateToAgo, postImgUrl } from "../utils/functions"
import { FaRegHeart, FaRegComment, FaRegTrashAlt, FaHeart } from "react-icons/fa"
import CommentList from "./CommentList"

export default function Post({ post, onDeletePost, onToggleLike }) {
    const [isCommentBoxOpened, setIsCommentBoxOpened] = useState(false)

    return (
        <div className="post">
            <div className="post-header">
                <img src={post.profileImgUrl} className="post-profile-img" />

                <div>
                    <div className="post-username">{post.userName}</div>
                    <div className="post-created-at">{dateToAgo(post.createdAt)}</div>
                </div>
            </div>

            {post.desc && <div className="post-desc">{post.desc}</div>}

            {post.imgUrl && (
                <div className="post-img-box">
                    <img src={postImgUrl(post.imgUrl)} className="post-img" />
                </div>
            )}

            <div className="post-footer">
                <div className="post-btns">
                    <button className="post-btn" onClick={() => onToggleLike(post.id)}>
                        {post.isLiked ? <FaHeart size={24} fill="red" /> : <FaRegHeart size={24} />}
                    </button>

                    <button className="post-btn" onClick={() => setIsCommentBoxOpened(!isCommentBoxOpened)}>
                        <FaRegComment size={24} />
                    </button>

                    {post.isPosted === 1 && (
                        <button className="post-btn" onClick={() => onDeletePost(post.id)}>
                            <FaRegTrashAlt size={24} />
                        </button>
                    )}
                </div>

                <div className="post-summary">{post.totalLikes} likes, {post.totalComments} comments</div>
            </div>

            {isCommentBoxOpened && <CommentList postId={post.id} />}
        </div>
    )
}