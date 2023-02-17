import { useContext } from "react"
import { MdDelete } from "react-icons/md"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { dateToAgo, fullName } from "../utils/functions"
import { AuthContext } from "./Auth"
import Image from "./Image"

// export default function Comment({ comment, onDeleteComment }) {
//     const { currentUser } = useContext(AuthContext)

//     return (
//         <div className="comment">
//             <div className="comment-header">
//                 <Image src={comment.user.profileImage.url}  alt={DEFAULT_PROFILE_IMG} className="comment-img"/>

//                 <div className="comment-header-right">
//                     <span className="comment-username">{fullName(comment.user)}</span>
//                     <span className="comment-created-at">{dateToAgo(comment.createdAt)}</span>
//                 </div>
//             </div>

//             <p className="comment-content">{comment.comment}</p>

//             {comment.user._id === currentUser._id && (
//                 <div className="comment-footer">
//                     <button className="btn btn-sm btn-primary" onClick={() => onDeleteComment(comment._id)}>Delete</button>
//                 </div>
//             )}
//         </div>
//     )
// }
// export default function Comment({ comment, onDeleteComment }) {
//     const { currentUser } = useContext(AuthContext)

//     return (
//         <div className="comment">
//             <div className="flex gap-2">
//                 <Image src={comment.user.profileImage.url} alt={DEFAULT_PROFILE_IMG} className="w-9 h-9 rounded-full" />

//                 <div className="flex-1">
//                     <div className="flex gap-2 items-center">
//                         <span className="font-bold text-sm">{fullName(comment.user)}</span>
//                         <span className="text-gray-600 text-sm"> {dateToAgo(comment.createdAt)}</span>
//                     </div>
//                     <p className=" text-gray-600 mt-1">{comment.comment}</p>
//                 </div>

//                 {comment.user._id === currentUser._id && (
//                 <div className="comment-footer">
//                     <button className="btn btn-sm btn-primary" onClick={() => onDeleteComment(comment._id)}>
//                         <MdDelete size={24}/>
//                     </button>
//                 </div>
//             )}
//             </div>


          
//         </div>
//     )
// }
export default function Comment({ comment, onDeleteComment }) {
    const { currentUser } = useContext(AuthContext)

    return (
        <div className="mt-4 border-2 border-gray-300 rounded-md">
            <div className="card-header flex items-center justify-between">
                <p className="card-title">{fullName(comment.user)}</p>
                <p className="text-gray-600 text-sm">1 month ago</p>
            </div>
            <div className="card-body">
               {comment.comment}
            </div>
            <div className="card-footer text-right">
                <button className="btn btn-sm btn-primary">Remove</button>
            </div>
        </div>
    )
}