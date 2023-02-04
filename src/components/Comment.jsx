import { useContext } from "react"
import { MdDeleteOutline } from "react-icons/md"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { dateToAgo, fullName } from "../utils/functions"
import { AuthContext } from "./Auth"

export default function Comment({ comment, onDeleteComment }) {
    const { currentUser } = useContext(AuthContext)
    return (
        <div className="flex gap-3 px-3 py-4 border-t-2 border-gray-300">
            <img 
                src={comment.profileImage ? comment.profileImage.url : DEFAULT_PROFILE_IMG} 
                className="h-9 w-9 rounded-full object-cover" 
            />

            <div className="flex justify-between flex-1">
                <div className="">
                    <p className="">
                        <span className="text-sm font-[500]">{fullName(comment.user)}</span>
                        <span className="text-sm text-gray-600"> • {dateToAgo(comment.createdAt)}</span> 
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                </div>

                {comment.user._id === currentUser._id && (
                    <button 
                        className="p-1 bg-gray-200 rounded-full h-min hover:bg-gray-300" 
                        onClick={() => onDeleteComment(comment._id)}
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                )}
            </div>
        </div>
    )
}