import { Link } from "react-router-dom";

function Header() {

    return (
        <div className="bg-amber-50 flex justify-between">
            <div className="m-4">
                <img src = ".frontend/src/assets/react.svg" alt = "Logo" />
            </div>
            <div className="justify-self-stretch space-x-12 m-4">
                <Link href="/">Home</Link>
                <Link href="/Notification">Notification</Link>
                <Link href="/Channel">Profile</Link>
            </div>
        </div>
    )
}

export default Header;