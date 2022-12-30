import { Routes, Route } from "react-router-dom"
import { Authenticated, NotAuthenticated } from "./components/Auth"
import AddPostPage from "./pages/AddPostPage"
import ChangePasswordPage from "./pages/ChangePasswordPage"
import HomePage from "./pages/HomePage"
import SearchPage from "./pages/SearchPage"
import ProfilePage from "./pages/ProfilePage"
import EditAccountPage from "./pages/EditAccountPage"
import FollowersPage from "./pages/FollowersPage"
import FollowingPage from "./pages/FollowingsPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import Account from "./components/Account"
import Layout from "./components/Layout"

export default function App() {
    return (
        <Routes>
            <Route element={<Authenticated />}>
                <Route element={<Account />}>
                    <Route element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/add-post" element={<AddPostPage />} />
                        <Route path="/profile/:userId" element={<ProfilePage />} />
                        <Route path="/change-password" element={<ChangePasswordPage />} />
                        <Route path="/edit-account" element={<EditAccountPage />} />
                        <Route path="/followers" element={<FollowersPage />} />
                        <Route path="/followings" element={<FollowingPage />} />
                    </Route>
                </Route>
            </Route>

            <Route element={<NotAuthenticated />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
            </Route>
        </Routes>
    )
}