import { MdArrowBack } from "react-icons/md"
import { useNavigate } from "react-router-dom"

export default function ProfilePhotosPage() {
    const navigate = useNavigate()

    return (
        <div className="bg-white border-2 border-gray-300 rounded-md max-w-xl mx-auto my-8">
            <p className="px-4 py-3 border-b-2 border-gray-300 text-lg font-bold text-teal-600 flex items-center gap-2">
                <MdArrowBack size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
                All Photos
            </p>

            <div className="p-4 grid grid-cols-4 gap-2">
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
                <img className="rounded object-cover" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674721/jjys4e2kx3msqwrfpuy2.webp" alt="" />
            </div>
        </div>
    )
}