import { Link } from "react-router-dom"
import { fullName } from "../utils/functions"
import Image from "./Image"

export default function Users({ title, users }) {
    return (
        <div className="card" style={{ maxWidth: 600, margin: "auto" }}>
            <p className="card-header card-title">{title}</p>

            <div className="card-body">
                {users.map(user => (
                    <Link to={`/profile/${user._id}`} className="suggested" key={user.id}>
                        <Image src={user.profileImage?.url} alt={process.env.REACT_APP_DEFAULT_PROFILE_IMG} className="suggested-img"/>
                        <p className="suggested-name">{fullName(user)}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}