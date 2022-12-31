import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdSearch, MdHome, MdArrowDropDown, MdAdd } from "react-icons/md"
import { AccountContext } from "./Account"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"

export default function NavBar() {
    const navigate = useNavigate()
    const { account } = useContext(AccountContext)
    const [isDropDownOpened, setIsDropDownOpened] = useState(false)

    window.onclick = () => {
        isDropDownOpened && setIsDropDownOpened(false)
    }

    const handleDropDown = (event) => {
        event.stopPropagation()
        setIsDropDownOpened(true)
    }

    const handleLogout = (event) => {
        event.preventDefault()
        localStorage.removeItem("jwtToken")
        navigate("/login")
    }

    return (
        <div className="bg-white shadow-md fixed left-0 right-0 top-0 h-20">
            <div className="bg-white max-w-5xl px-2 flex justify-between items-center h-full mx-auto">
                <Link to="/" className="text-lg lg:text-2xl border-2 border-indigo-600 px-2 font-bold text-indigo-600">
                    MY DIARY
                </Link>

                <div className="flex gap-3">
                    <Link
                        className="bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center h-10 w-10 
                        text-gray-700"
                        to="/"
                    >
                        <MdHome size={24} />
                    </Link>

                    <Link
                        className="bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center h-10 w-10
                        text-gray-700"
                        to="/search"
                    >
                        <MdSearch size={24} />
                    </Link>

                    <Link
                        className="bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center h-10 w-10
                        text-gray-700"
                        to="/add-post"
                    >
                        <MdAdd size={24} />
                    </Link>

                    <div className="relative">
                        <div onClick={handleDropDown} className="flex items-center gap-1 cursor-pointer">
                            <img
                                src={account.profileImgUrl ? account.profileImgUrl : DEFAULT_PROFILE_IMG}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <MdArrowDropDown size={24} />
                        </div>

                        {isDropDownOpened && (
                            <div className="absolute right-0 top-0 mt-14 rounded-md bg-white shadow-md flex flex-col w-56 py-2">
                                <Link className="text-gray-700 py-3 px-4 hover:bg-gray-200" to={`/profile/${account.id}`}>Profile</Link>
                                <Link className="text-gray-700 py-3 px-4 hover:bg-gray-200" to="/followers">Followers</Link>
                                <Link className="text-gray-700 py-3 px-4 hover:bg-gray-200" to="/followings">Followings</Link>
                                <Link className="text-gray-700 py-3 px-4 hover:bg-gray-200" to="/change-password">Change Password</Link>
                                <Link className="text-gray-700 py-3 px-4 hover:bg-gray-200" onClick={handleLogout}>Logout</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}