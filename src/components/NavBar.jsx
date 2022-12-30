import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdSearch, MdHome, MdArrowDropDown, MdAdd } from "react-icons/md"
import { useAccountContext } from "./Account"

export default function NavBar() {
    const navigate = useNavigate()
    const { account } = useAccountContext()
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
        <div className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-title">
                    MY DIARY
                </Link>

                <div className="navbar-icons">
                    <Link className="navbar-link" to="/">
                        <MdHome size={24} />
                    </Link>

                    <Link className="navbar-link" to="/search">
                        <MdSearch size={24} />
                    </Link>

                    <Link className="navbar-link" to="/add-post">
                        <MdAdd size={24} />
                    </Link>

                    <div className="navbar-dropdown">
                        <div onClick={handleDropDown} className="navbar-dropdown-btn" >
                            <img src={account.profileImgUrl} className="navbar-dropdown-img" />
                            <MdArrowDropDown size={24} />
                        </div>

                        {isDropDownOpened && (
                            <div className="navbar-dropdown-menu">
                                <Link className="navbar-dropdown-link" to={`/profile/${account.id}`}>Profile</Link>
                                <Link className="navbar-dropdown-link" to="/followers">Followers</Link>
                                <Link className="navbar-dropdown-link" to="/followings">Followings</Link>
                                <Link className="navbar-dropdown-link" to="/change-password">Change Password</Link>
                                <Link className="navbar-dropdown-link" onClick={handleLogout}>Logout</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}