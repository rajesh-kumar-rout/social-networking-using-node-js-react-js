import { MY_IMG } from "../utils/constants"

export default function Footer() {
    return (
        <div className="footer">
            <img src={MY_IMG} className="footer-img"/>
            <p>Designed and devloped by Rajesh Rout</p>
        </div>
    )
}