import axios from "axios"
import { useContext, useState } from "react"
import { MdAdd, MdArrowDropDown, MdHome, MdSearch } from "react-icons/md"
import { Link, NavLink } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { AuthContext } from "./Auth"

export default function NavBar() {
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
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    return (
        <div className="bg-white shadow-md fixed left-0 right-0 top-0 h-20">
            <div className="bg-white max-w-5xl px-2 flex justify-between items-center h-full mx-auto">
                <Link to="/" className="text-lg lg:text-2xl border-2 border-indigo-600 px-2 font-bold text-indigo-600">
                    MY DIARY
                </Link>

                <div className="flex gap-3">
                    <Link className="navbar-icon" to="/">
                        <MdHome size={24} />
                    </Link>

                    <Link className="navbar-icon" to="/search">
                        <MdSearch size={24} />
                    </Link>

                    <Link className="navbar-icon" to="/add-post">
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

                        {isDropDownOpened && (
                            <div className="absolute right-0 top-0 mt-16 rounded-md bg-white shadow-md flex flex-col w-48 py-2">
                                <NavLink
                                    className={({ isActive }) => `navbar-dropdown-item ${isActive ? 'navbar-dropdown-item-active' : ''}`}
                                    to={`/auth/profile/${currentUser.id}`}
                                >
                                    Profile
                                </NavLink>

                                <NavLink
                                    className={({ isActive }) => `navbar-dropdown-item ${isActive ? 'navbar-dropdown-item-active' : ''}`}
                                    to="/auth/followers"
                                >
                                    Followers
                                </NavLink>

                                <NavLink
                                    className={({ isActive }) => `navbar-dropdown-item ${isActive ? 'navbar-dropdown-item-active' : ''}`}
                                    to="/auth/followings"
                                >
                                    Followings
                                </NavLink>

                                <NavLink
                                    className={({ isActive }) => `navbar-dropdown-item ${isActive ? 'navbar-dropdown-item-active' : ''}`}
                                    to="/auth/change-password"
                                >
                                    Change Password
                                </NavLink>

                                <NavLink
                                    className={({ isActive }) => `navbar-dropdown-item ${isActive ? 'navbar-dropdown-item-active' : ''}`}
                                    to="/auth/logout"
                                    onClick={handleLogout}
                                >
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