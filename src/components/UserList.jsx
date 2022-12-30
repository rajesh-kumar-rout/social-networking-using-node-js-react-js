import { Link } from "react-router-dom"

export default function UserList({ title, users }) {
    return (
        <div className="card card-1">
            <p className="card-header semibold">{title}</p>

            <div className="divider divider-gray">
                {users.map(user => (
                    <Link to={"/profile/" + user.id} className="user" key={user.id}>
                        <img src={user.profileImgUrl} className="user-img" />
                        <p className="semibold">{user.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}