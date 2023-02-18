import { useContext, useState } from "react"
import { FaHeart, FaRegComment, FaRegHeart, FaRegTrashAlt } from "react-icons/fa"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { cloudiImgUrl, dateToAgo, fullName } from "../utils/functions"
import { AuthContext } from "./Auth"
import CommentBox from "./CommentBox"
import Image from "./Image"

export default function Post({ post, onDeletePost, onToggleLike }) {
    const { currentUser } = useContext(AuthContext)
    const [isCommentBoxOpened, setIsCommentBoxOpened] = useState(false)

    return (
        <div className="post">
            <div className="post-header">
                <Image src={post.user.profileImage?.url} alt={DEFAULT_PROFILE_IMG} className="post-profile-img"/>

                <div>
                    <div className="post-username">{fullName(post.user)}</div>
                    <div className="post-created-at">{dateToAgo(post.createdAt)}</div>
                </div>
            </div>

            {post.description && <div className="post-description">{post.description}</div>}

            {post.image && (
                <img src={cloudiImgUrl(post.image.url)} className="w-full object-cover" />
            )}

            {post.videoUrl && (
                <iframe width="100%" height="345" src={post.videoUrl}></iframe>
            )}

            <div className="post-footer">
                <div className="post-actions">
                    <button
                        className="post-action"
                        onClick={() => onToggleLike(post._id)}
                    >
                        {post.isLiked ? <FaHeart size={24} fill="var(--pink600)" /> : <FaRegHeart size={24} />}
                    </button>

                    <button
                        className="post-action"
                        onClick={() => setIsCommentBoxOpened(!isCommentBoxOpened)}
                    >
                        <FaRegComment size={24} />
                    </button>

                    {post.user._id === currentUser._id && (
                        <button
                            className="post-action"
                            onClick={() => onDeletePost(post._id)}
                        >
                            <FaRegTrashAlt size={24} />
                        </button>
                    )}
                </div>

                <div className="post-footer-text">{post.totalLikes} likes, {post.totalComments} comments</div>
            </div>

            {isCommentBoxOpened && <CommentBox postId={post._id} />}
        </div>
    )
}