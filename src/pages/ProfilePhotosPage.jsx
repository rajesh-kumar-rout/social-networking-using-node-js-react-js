import axios from "../utils/axios"
import { useEffect, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { useNavigate, useParams } from "react-router-dom"

export default function ProfilePhotosPage() {
    const navigate = useNavigate()
    const { userId } = useParams()
    const [photos, setPhotos] = useState([])

    async function fetchPhotos() {
        const { data } = await axios.get(`/users/${userId}/photos`)
        console.log(data)
        setPhotos(data)
    }

    useEffect(() => {
        fetchPhotos()
    }, [])

    return (
        <div className="card" style={{ marginTop: 24 }}>
            <p className="card-header card-title profile-back-nav">
                <button onClick={() => navigate(-1)} >
                    <MdArrowBack size={24} />
                </button>
                All Photos
            </p>

            {photos.length === 0 ? (
                <p className="card-body" style={{ textAlign: "center" }}>No Photos Found</p>
            ) : (
                <div className="card-body photos">
                    {photos.map(photo => <img key={photo.image} src={photo.image.url} alt="" />)}
                </div>
            )}
        </div>
    )
}