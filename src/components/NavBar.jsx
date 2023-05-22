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

                <ul className="navbar-links">
                    <li>
                        <Link to="/search" className="navbar-link">
                            <MdSearch size={24} />
                        </Link>
                    </li>

                    <li className="navbar-dropdown-wrapper">
                        <div onClick={handleDropDown} className="navbar-dropdown-btn">
                            <Image src={currentUser.profileImage?.url} alt={process.env.REACT_APP_DEFAULT_PROFILE_IMG} className="navbar-dropdown-img" />
                            <MdArrowDropDown size={24} />
                        </div>

                        {isDropDownOpened && (
                            <ul className="navbar-dropdown">
                                <li>
                                    <Link className="navbar-dropdown-link" to={`/profile/${currentUser._id}`}>My Profile</Link>
                                </li>
                                <li>
                                    <Link className="navbar-dropdown-link" to="/followers">Followers</Link>
                                </li>
                                <li>
                                    <Link className="navbar-dropdown-link" to="/followings">Followings</Link>
                                </li>
                                <li>
                                    <Link className="navbar-dropdown-link" to="/edit-profile">Edit Profile</Link>
                                </li>
                                <li>
                                    <Link className="navbar-dropdown-link" to="" onClick={handleLogout}>Logout</Link>
                                </li>
                                <li>
                                    <a className="navbar-dropdown-link" href={process.env.REACT_APP_MY_WEBSITE}>About Devloper</a>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    )
}