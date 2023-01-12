import axios from "axios"
import { useContext, useState } from "react"
import { MdAdd, MdArrowDropDown, MdHome, MdLock, MdLogout, MdPeople, MdPerson, MdPersonAdd, MdSearch } from "react-icons/md"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { AuthContext } from "./Auth"

export default function NavBar() {
    const navigate = useNavigate()
    const { currentUser } = useContext(AuthContext)
    const [isDropDownOpened, setIsDropDownOpened] = useState(false)

    window.onclick = () => {
        isDropDownOpened && setIsDropDownOpened(false)
    }

    const handleDropDown = (event) => {
        event.stopPropagation()
        setIsDropDownOpened(true)
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        await axios.get("/auth/logout")
        window.location.href = "/login"
    }

    return (
        <div className="bg-white shadow-md fixed left-0 right-0 top-0 h-20">
            <div className="bg-white max-w-5xl px-2 flex justify-between items-center h-full mx-auto">
                <Link to="/" className="text-lg lg:text-2xl border-2 border-indigo-600 px-2 font-bold text-indigo-600">
                    MY DIARY
                </Link>

                <div className="flex gap-3">
                    <Link
                        className="bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center h-9 w-9 
                        text-gray-700"
                        to="/"
                    >
                        <MdHome size={24} />
                    </Link>

                    <Link
                        className="bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center h-9 w-9
                        text-gray-700"
                        to="/search"
                    >
                        <MdSearch size={24} />
                    </Link>

                    <Link
                        className="bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center h-9 w-9
                        text-gray-700"
                        to="/add-post"
                    >
                        <MdAdd size={24} />
                    </Link>

                    <div className="relative">
                        <div onClick={handleDropDown} className="flex items-center gap-1 cursor-pointer">
                            <img
                                src={currentUser.profileImgUrl ? currentUser.profileImgUrl : DEFAULT_PROFILE_IMG}
                                className="h-9 w-9 rounded-full object-cover"
                            />
                            <MdArrowDropDown size={24} />
                        </div>
                        {/* 
                        {isDropDownOpened && (
                            <div className="absolute right-0 top-0 mt-16 rounded-md bg-white shadow-md flex flex-col w-56 py-1">
                                <Link className="text-gray-700 py-2 px-3 hover:bg-gray-200 flex items-center gap-2" to={`/profile/${currentUser.id}`}>
                                    <div className="bg-gray-200 p-2 rounded-full">
                                        <MdPerson size={24} />

                                    </div>
                                    Profile</Link>
                                <Link className="text-gray-700 py-2 px-3 hover:bg-indigo-600 hover:text-white hover:fill-white flex items-center gap-2" to="/followers">
                                    <div className="bg-gray-200 p-2 rounded-full">
                                        <MdPersonAdd size={24} />

                                    </div>
                                    Followers</Link>
                                <Link className="text-gray-700 py-1 px-2 hover:bg-gray-200 flex items-center gap-2" to="/followings">
                                    <div className="bg-gray-200 p-2 rounded-full">
                                        <MdPeople size={24} />

                                    </div>
                                    Followings</Link>
                                <Link className="text-gray-700 py-1 px-2 hover:bg-gray-200 flex items-center gap-2"
                                    to="/change-password">
                                    <div className="bg-gray-200 p-2 rounded-full ">
                                        <MdLock size={24} />

                                    </div>
                                    Change Password</Link>
                                <Link className="text-gray-700 py-1 px-2 hover:bg-gray-200 flex items-center gap-2"
                                    onClick={handleLogout}>
                                    <div className="bg-gray-200 p-2 rounded-full ">
                                        <MdLogout size={24} />

                                    </div>
                                    Logout</Link>
                            </div>
                        )} */}

                        {isDropDownOpened && (
                            <div className="absolute right-0 top-0 mt-16 rounded-md bg-white shadow-md flex flex-col w-48 py-2">
                                <NavLink className={({ isActive }) => `text-gray-700 py-2 px-3 hover:bg-indigo-600 hover:text-white flex items-center gap-2 ${isActive ? 'bg-indigo-600 text-white' : ''}`} to={`/auth/profile/${currentUser.id}`}>
                                    Profile
                                </NavLink>

                                <NavLink className={({ isActive }) => `text-gray-700 py-2 px-3 hover:bg-indigo-600 hover:text-white flex items-center gap-2 ${isActive ? 'bg-indigo-600 text-white' : ''}`} to="/auth/followers">
                                    Followers
                                </NavLink>
                                <NavLink className={({ isActive }) => `text-gray-700 py-2 px-3 hover:bg-indigo-600 hover:text-white flex items-center gap-2 ${isActive ? 'bg-indigo-600 text-white' : ''}`} to="/auth/followings">
                                    Followings
                                </NavLink>
                                <NavLink className={({ isActive }) => `text-gray-700 py-2 px-3 hover:bg-indigo-600 hover:text-white flex items-center gap-2 ${isActive ? 'bg-indigo-600 text-white' : ''}`}
                                    to="/auth/change-password">
                                    Change Password
                                </NavLink>
                                <NavLink to="/auth/logout" className={({ isActive }) => `text-gray-700 py-2 px-3 hover:bg-indigo-600 hover:text-white flex items-center gap-2 ${isActive ? 'bg-indigo-600 text-white' : ''}`}
                                    onClick={handleLogout}>
                                    Logout
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}