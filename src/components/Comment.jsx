import { MdDeleteOutline } from "react-icons/md"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { dateToAgo } from "../utils/functions"

export default function Comment({ comment, onDeleteComment }) {
    return (
        <div className="flex gap-3 px-3 py-4 border-t-2 border-gray-300">
            <img 
                src={comment.profileImageUrl ? comment.profileImageUrl : DEFAULT_PROFILE_IMG} 
                className="h-9 w-9 rounded-full object-cover" 
            />

            <div className="flex justify-between flex-1">
                <div className="">
                    <p className="">
                        <span className="text-sm font-[500]">{comment.userName}</span>
                        <span className="text-sm text-gray-600"> • {dateToAgo(comment.createdAt)}</span> 
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                </div>

                {comment.isCommented === 1 && (
                    <button 
                        className="p-1 bg-gray-200 rounded-full h-min hover:bg-gray-300" 
                        onClick={() => onDeleteComment(comment.id)}
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                )}
            </div>
        </div>
    )
}