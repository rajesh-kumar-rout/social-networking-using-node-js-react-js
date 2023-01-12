import { Routes, Route } from "react-router-dom"
import Authenticated from "./components/Authenticated"
import NotAuthenticated from "./components/NotAuthenticated"
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
import Account from "./components/Auth"
import Layout from "./components/Layout"

export default function App() {
    return (
        <Routes>
            <Route element={<Account />}>
                <Route element={<Authenticated />}>
                    <Route element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/add-post" element={<AddPostPage />} />
                        <Route path="/auth/profile/:userId" element={<ProfilePage />} />
                        <Route path="/profile/:userId" element={<ProfilePage />} />
                        <Route path="/auth/change-password" element={<ChangePasswordPage />} />
                        <Route path="/edit-account" element={<EditAccountPage />} />
                        <Route path="/auth/followers" element={<FollowersPage />} />
                        <Route path="/auth/followings" element={<FollowingPage />} />
                    </Route>
                </Route>
                <Route element={<NotAuthenticated />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                </Route>
            </Route>
        </Routes>
    )
}