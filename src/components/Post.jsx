import { useContext, useState } from "react"
import { FaHeart, FaRegComment, FaRegHeart, FaRegTrashAlt } from "react-icons/fa"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { cloudiImgUrl, dateToAgo, fullName } from "../utils/functions"
import { AuthContext } from "./Auth"
import CommentBox from "./CommentBox"

// export default function Post({ post, onDeletePost, onToggleLike }) {
//     const [isCommentBoxOpened, setIsCommentBoxOpened] = useState(false)

//     return (
//         <div className="bg-white shadow-md md:rounded-lg mx-auto w-[600px]">
//             <div className="p-3 flex gap-3">
//                 <img 
//                     src={post.profileImgUrl ? post.profileImgUrl : DEFAULT_PROFILE_IMG} 
//                     className="w-12 h-12 rounded-full object-cover" 
//                 />

//                 <div>
//                     <div className="text-sm font-bold">{post.userName}</div>
//                     <div className="text-sm mt-1 text-gray-600">{dateToAgo(post.createdAt)}</div>
//                 </div>
//             </div>

//             {post.desc && <div className="text-sm text-gray-600 px-3 pb-3">{post.desc}</div>}

//             {post.imgUrl && (
//                 <img src={postImgUrl(post.imgUrl)} className="w-full object-cover" />
//             )}

//             <div className="p-3 flex justify-between">
//                 <div className="flex items-center gap-3">
//                     <button 
//                         className="post-action-btn" 
//                         onClick={() => onToggleLike(post.id)}
//                     >
//                         {post.isLiked ? <FaHeart size={24} fill="red" /> : <FaRegHeart size={24} />}
//                     </button>

//                     <button 
//                         className="post-action-btn" 
//                         onClick={() => setIsCommentBoxOpened(!isCommentBoxOpened)}
//                     >
//                         <FaRegComment size={24} />
//                     </button>

//                     {post.isPosted === 1 && (
//                         <button 
//                             className="post-action-btn" 
//                             onClick={() => onDeletePost(post.id)}
//                         >
//                             <FaRegTrashAlt size={24} />
//                         </button>
//                     )}
//                 </div>

//                 <div className="text-gray-600 text-sm">{post.totalLikes} likes, {post.totalComments} comments</div>
//             </div>

//             {isCommentBoxOpened && <CommentBox postId={post.id} />}
//         </div>
//     )
// }
export default function Post({ post, onDeletePost, onToggleLike }) {
    const { currentUser } = useContext(AuthContext)
    const [isCommentBoxOpened, setIsCommentBoxOpened] = useState(false)
console.log(post)
    return (
        <div className="bg-white border-2 border-x-0 sm:border-x-2 border-gray-300 sm:rounded-md mx-auto w-full sm:w-[600px]">
            <div className="p-3 flex gap-3">
                <img
                    src={post.profileImage ? post.profileImage.url : DEFAULT_PROFILE_IMG}
                    className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                    <div className="text-sm font-bold">{fullName(post.user)}</div>
                    <div className="text-sm mt-1 text-gray-600">{dateToAgo(post.createdAt)}</div>
                </div>
            </div>

            {post.description && <div className="text-sm text-gray-600 px-3 pb-3">{post.description}</div>}

            {post.image && (
                <img src={cloudiImgUrl(post.image.url)} className="w-full object-cover" />
            )}

            {post.videoUrl && (
                <iframe width="100%" height="345" src={post.videoUrl}></iframe>
            )}

            <div className="p-3 flex justify-between">
                <div className="flex items-center gap-3">
                    <button
                        className="post-action-btn fill-pink-600"
                        onClick={() => onToggleLike(post._id)}
                    >
                        {post.isLiked ? <FaHeart size={24} fill="fill-pink-600" /> : <FaRegHeart size={24} />}
                    </button>

                    <button
                        className="post-action-btn"
                        onClick={() => setIsCommentBoxOpened(!isCommentBoxOpened)}
                    >
                        <FaRegComment size={24} />
                    </button>

                    {post.user._id === currentUser._id && (
                        <button
                            className="post-action-btn"
                            onClick={() => onDeletePost(post._id)}
                        >
                            <FaRegTrashAlt size={24} />
                        </button>
                    )}
                </div>

                <div className="text-gray-600 text-sm">{post.totalLikes} likes, {post.totalComments} comments</div>
            </div>

            {isCommentBoxOpened && <CommentBox postId={post._id} />}
        </div>
    )
}