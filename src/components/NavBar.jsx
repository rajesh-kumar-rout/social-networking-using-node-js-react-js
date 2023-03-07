import { useContext, useState } from "react"
import { MdArrowDropDown, MdSearch } from "react-icons/md"
import { Link } from "react-router-dom"
import { AuthContext } from "./Auth"
import Image from "./Image"

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
                            <Image src={currentUser.profileImage?.url} alt={process.env.REACT_APP_DEFAULT_PROFILE_IMG} className="navbar-dropdown-img"/>
                            <MdArrowDropDown size={24} />
                        </div>

                        {isDropDownOpened && (
                            <div className="navbar-dropdown">
                                <Link className="navbar-dropdown-link" to={`/profile/${currentUser._id}`}>
                                    My Profile
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

                                <a className="navbar-dropdown-link" href="https://rajeshrout.netlify.app/">
                                    About Devloper
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}