import axios from "axios"
import { useContext, useState } from "react"
import { MdArrowDropDown, MdSearch } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { AuthContext } from "./Auth"

// export default function NavBar() {
//     const navigate = useNavigate()
//     const { currentUser } = useContext(AuthContext)
//     const [isDropDownOpened, setIsDropDownOpened] = useState(false)
//     const [isSearchOpened, setIsSearchOpened] = useState(false)

//     window.onclick = () => {
//         isDropDownOpened && setIsDropDownOpened(false)
//         isSearchOpened && setIsSearchOpened(false)
//     }

//     const handleDropDown = (event) => {
//         event.stopPropagation()
//         setIsDropDownOpened(true)
//     }

//     const handleLogout = async (event) => {
//         event.preventDefault()

//         localStorage.removeItem("authToken")

//         window.location.href = "/login"
//     }
    
//     const handleSearch = async (event) => {
//         event.preventDefault()
//         event.stopPropagation()
//         setIsSearchOpened(true)
//     }

//     function handleSubmit(event) {
//         event.preventDefault()
//         navigate(`/search?query=${event.target.query.value}`)
//         setIsSearchOpened(false)
//         event.target.reset()
//     }

//     return (
//         <div className="bg-white border-b-2 border-gray-300 fixed left-0 right-0 top-0 h-20 z-40">
//             <div className="bg-white max-w-5xl px-2 items-center h-full mx-auto flex justify-between flex-wrap">
//                 <Link to="/" className="text-lg lg:text-2xl px-2 font-bold text-teal-600">
//                     MY DIARY
//                 </Link>

//                 <form
//                     onSubmit={handleSubmit}
//                     className="bg-gray-100 px-4 w-[350px] py-1 items-center rounded-md gap-2 hidden md:flex"
//                 >
//                     <MdSearch size={24} className="text-gray-600" />
//                     <input
//                         type="search"
//                         name="query"
//                         className="bg-transparent outline-none border-none focus:ring-0 w-full"
//                         placeholder="Search people by name..."
//                     />
//                 </form>

//                 <div className="flex gap-4">
//                     <button className="relative md:hidden" onClick={handleSearch}>
//                         <MdSearch size={24} />
//                         {isSearchOpened && (
//                             <form 
//                                 onSubmit={handleSubmit} 
//                                 className="absolute bg-white rounded-md border-2 border-gray-300 top-10 right-0 p-3 w-[300px]"
//                             >
//                                 <input type="search" name="query" className="form-control" placeholder="Search people by name..." />
//                             </form>
//                         )}
//                     </button>

//                     <div className="relative">
//                         <div onClick={handleDropDown} className="flex items-center cursor-pointer">
//                             <img
//                                 src={currentUser.profileImage ? currentUser.profileImage.url : DEFAULT_PROFILE_IMG}
//                                 className="h-9 w-9 rounded-full object-cover"
//                             />
//                             <MdArrowDropDown size={24} />
//                         </div>

//                         {isDropDownOpened && (
//                             <div
//                                 className="absolute right-0 top-full mt-5 text-white rounded-md bg-teal-600 shadow-md 
//                                 flex flex-col gap-5 w-48 p-5 z-50"
//                             >
//                                 <Link
//                                     className="navbar-dr k"
//                            to={`/profile/${currid}`}
//                                 >
//                                     Profile
//                                 </Link>

//                                 <Link
//                                     className="navbar-dr k"
//                            to="/auth/"
//                                 >
//                                     Followers
//                                 </Link>

//                                 <Link
//                                     className="text-white hover:text-gray-300 flex items-center gap-2"
//                                     to="/auth/followings"
//                                 >
//                                     Followings
//                                 </Link>

//                                 <Link
//                                     className="text-white hover:text-gray-300 flex items-center gap-2"
//                                     to="/auth/edit-profile"
//                                 >
//                                     Edit Profile
//                                 </Link>

//                                 <Link
//                                     className="text-white hover:text-gray-300 flex items-center gap-2"
//                                     to="/auth/logout"
//                                     onClick={handleLogout}
//                                 >
//                                     Logout
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
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
        localStorage.removeItem("authToken")
        window.location.href = "/login"
    }

    return (
        <div className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-title">MY DIARY</Link>

                <div className="navbar-links">
                    <Link to="search" className="navbar-link">
                        <MdSearch size={24}/>
                    </Link>

                    <div className="navbar-dropdown-wrapper">
                        <div onClick={handleDropDown} className="navbar-dropdown-btn">
                            <img
                                src={currentUser.profileImage ? currentUser.profileImage.url : DEFAULT_PROFILE_IMG}
                                className="navbar-dropdown-img"
                            />
                            <MdArrowDropDown size={24} />
                        </div>

                        {isDropDownOpened && (
                            <div className="navbar-dropdown">
                                <Link className="navbar-dropdown-link" to={`/profile/${currentUser._id}`}>
                                    Profile
                                </Link>

                                <Link className="navbar-dropdown-link" to="/auth/followers">
                                    Followers
                                </Link>

                                <Link className="navbar-dropdown-link" to="/auth/followings">
                                    Followings
                                </Link>

                                <Link className="navbar-dropdown-link" to="/auth/edit-profile">
                                    Edit Profile
                                </Link>

                                <Link className="navbar-dropdown-link" to="/auth/logout" onClick={handleLogout}>
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}