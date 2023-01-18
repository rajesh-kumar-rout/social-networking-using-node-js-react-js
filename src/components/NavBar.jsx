import axios from "axios"
import { useContext, useState } from "react"
import { MdAdd, MdArrowDropDown, MdHome, MdSearch } from "react-icons/md"
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
        await axios.delete("/auth/logout")
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    function handleSubmit(event) {
        event.preventDefault()
        navigate(`/search/${event.target.query.value}`)
        event.target.reset()
    }

    return (
        <div className="bg-white border-b-2 border-gray-300 fixed left-0 right-0 top-0 h-20">
            <div className="bg-white max-w-5xl px-2 flex justify-between items-center h-full mx-auto">
                <Link to="/" className="text-lg lg:text-2xl px-2 font-bold text-teal-600">
                    MY DIARY
                </Link>

                <form onSubmit={handleSubmit} className="bg-gray-100 px-4 py-2 flex items-center w-[300px] rounded-md gap-4">
                    <MdSearch size={24} className="text-gray-600" />
                    <input type="search" name="query" className="bg-transparent outline-none w-full" placeholder="Search here..." />
                </form>

                <div className="flex gap-3">
                    {/* <Link className="navbar-icon relative group" to="/">
                        <MdHome size={24} />
                        <p className="bg-gray-800 absolute text-white px-2 py-1 rounded text-xs top-full mt-1 hidden group-hover:inline-block">Home</p>
                    </Link>

                    <Link className="navbar-icon relative group" to="/search">
                        <MdSearch size={24} />
                        <p className="bg-gray-800 absolute text-white px-2 py-1 rounded text-xs top-full mt-1 hidden group-hover:inline-block">Search</p>

                    </Link>

                    <Link className="navbar-icon" to="/add-post">
                        <MdAdd size={24} />
                    </Link> */}

                    <div className="relative">
                        <div onClick={handleDropDown} className="flex items-center cursor-pointer">
                            <img
                                src={currentUser.profileImageUrl ? currentUser.profileImageUrl : DEFAULT_PROFILE_IMG}
                                className="h-9 w-9 rounded-full object-cover"
                            />
                            <MdArrowDropDown size={24} />
                        </div>

                        {isDropDownOpened && (
                            <div className="absolute right-0 top-full mt-5 z-50  text-white rounded-md bg-teal-600 shadow-md flex 
                            flex-col gap-5 w-48 p-5">
                                <NavLink
                                    className={({ isActive }) => `navbar-dropdown-item ${isActive ? 'navbar-dropdown-item-active' : ''}`}
                                    to={`/profile/${currentUser.id}`}
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
                                    to="/auth/edit-profile"
                                >
                                    Edit Profile
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