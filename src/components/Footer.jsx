import { MY_IMG } from "../utils/constants"

export default function Footer() {
    return (
        <div className="fixed left-0 bottom-0 right-0 border-t-2 border-gray-300 h-16 flex items-center justify-center gap-4 bg-white">
            <img src={MY_IMG} className="h-10 w-10 object-cover rounded-full"/>
            <p className="text-sm text-gray-700">Designed and devloped by Rajesh Rout <br /> Want to hire me ? <a href="https://rajeshrout.netlify.app/" className="underline text-teal-600">Visit website</a> </p>
        </div>
    )
}