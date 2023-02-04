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
        <div className="bg-white border-2 border-x-0 sm:border-x-2 border-gray-300 sm:rounded-md max-w-xl mx-auto my-8">
            <p className="px-4 py-3 border-b-2 border-gray-300 text-lg font-bold text-teal-600 flex items-center gap-2">
                <MdArrowBack size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
                All Photos
            </p>

            {photos.length === 0 ? (
                <p className="text-sm text-gray-600 text-center p-4">No Photos Found</p>
            ) : (
                <div className="p-4 grid grid-cols-4 gap-2">
                    {photos.map(photo => (
                        <img key={photo.image} className="rounded object-cover" src={photo.image.url} alt="" />
                    ))}
                </div>
            )}
        </div>
    )
}