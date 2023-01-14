import { MdPeopleAlt, MdPersonAdd } from "react-icons/md"
import { Link } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"

export default function Users({ title, users }) {
    
    return (
        <div className="bg-white max-w-2xl border-2 border-gray-300 rounded-md mx-auto my-6">
            <p className="border-b-2 border-gray-300 px-4 py-3 font-bold text-lg text-teal-600">{title}</p>

            <div className="divider-y-2 divide-gray-300">
                {users.map((user, key) => (
                    <div className="flex justify-between items-center py-3 px-4 border-t-2 border-t-gray-300 first:border-t-0">
                        <Link
                            to={`/profile/${user.id}`}
                            className="border-t-2 border-gray-300 first:border-none flex items-center gap-3"
                            key={user.id}
                        >
                            <img
                                src={user.profileImgUrl ? user.profileImgUrl : DEFAULT_PROFILE_IMG}
                                className="h-12 w-12 object-cover rounded-full"
                            />
                            <p className="font-semibold">{user.name}</p>
                        </Link>

                    </div>
                ))}
                {users.map((user, key) => (
                    <div className="flex justify-between items-center py-3 px-4 border-t-2 border-t-gray-300 first:border-t-0">
                        <Link
                            to={`/profile/${user.id}`}
                            className="border-t-2 border-gray-300 first:border-none flex items-center gap-3"
                            key={user.id}
                        >
                            <img
                                src={user.profileImgUrl ? user.profileImgUrl : DEFAULT_PROFILE_IMG}
                                className="h-12 w-12 object-cover rounded-full"
                            />
                            <p className="font-semibold">{user.name}</p>
                        </Link>
                        <button className="bg-gray-200 rounded-full p-2 relative group">
                            <MdPersonAdd size={24}/>
                        <p className="bg-gray-800 absolute text-white px-2 py-1 rounded text-xs top-full mt-1 hidden 
                        group-hover:inline-block">Follow</p>

                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}