import { Link } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"

export default function UserList({ title, users }) {
    return (
        <div className="bg-white max-w-2xl border-2 border-gray-300 rounded-md mx-auto my-6">
            <p className="border-b-2 border-gray-300 px-4 py-3 font-semibold">{title}</p>

            <div className="divider-y-2 divide-gray-300">
                {users.map(user => (
                    <Link 
                        to={`/profile/${user.id}`} 
                        className="border-t-2 border-gray-300 first:border-none py-3 px-4 flex items-center gap-3" 
                        key={user.id}
                    >
                        <img 
                            src={user.profileImgUrl ? user.profileImgUrl : DEFAULT_PROFILE_IMG} 
                            className="h-12 w-12 object-cover rounded-full" 
                        />
                        <p className="font-semibold">{user.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}