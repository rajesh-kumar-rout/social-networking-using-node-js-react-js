import { Link } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { fullName } from "../utils/functions"

export default function Users({ title, users }) {

    return (
        <div className="bg-white max-w-xl border-2 border-x-0 sm:border-x-2 border-gray-300 sm:rounded-md mx-auto my-6">
            <p className="border-b-2 border-gray-300 px-4 py-3 font-bold text-lg text-teal-600">{title}</p>

            <div>
                {users.map(user => (
                    <Link
                        to={`/profile/${user._id}`}
                        className="py-3 px-4 border-t-2 first:border-t-0 border-t-gray-300 flex items-center gap-3"
                        key={user.id}
                    >
                        <img
                            src={user.profileImage ? user.profileImage.url : DEFAULT_PROFILE_IMG}
                            className="h-12 w-12 object-cover rounded-full"
                        />
                        <p className="font-semibold">{fullName(user)}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}