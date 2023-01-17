import { ErrorMessage, Field, Form, Formik } from "formik"
import { useContext, useEffect, useReducer, useState } from "react"
import { toast } from "react-toastify"
import { AuthContext } from "../components/Auth"
import Loader from "../components/Loader"
import axios from "../utils/axios"
import { changePasswordSchema, editAccountSchema } from "../utils/validationSchema"

export default function EditProfilePage() {
    const { currentUser } = useContext(AuthContext)
    const [user, setUser] = useState({})
    const [isDeleting, setIsDeleting] = useState(false)

    const handleProfileUpdate = async (values, { resetForm, setSubmitting }) => {
        setSubmitting(true)

        try {
            await axios.patch("/auth/edit-account", values)

            toast.success("Account updated successfully")

        } catch ({ response }) {

            response.status === 409 && toast.error("Email already exists")
        }

        setSubmitting(false)
    }
    const handlePasswordChange = async (values, { resetForm, setSubmitting }) => {
        setSubmitting(true)

        try {
            await axios.patch("/auth/change-password", values)

            resetForm()

            toast.success("Password changed successfully")

        } catch ({ response }) {

            response.status === 422 && toast.error("Old password does not match")
        }

        setSubmitting(false)
    }
    const handleDeleteProfile = async (values, { resetForm, setSubmitting }) => {
        setIsDeleting(true)

        await axios.delete("/auth")

        toast.success("Account deleted succesfully")

        window.location.href = "/login"

        setIsDeleting(false)
    }

    return (
        <div

        >
            <Formik
                initialValues={currentUser}
                validationSchema={editAccountSchema}
                onSubmit={handleProfileUpdate}
            >

                {({ isSubmitting, values }) => (
                    <Form className="max-w-xl mx-auto my-8 bg-white border-2 border-gray-300 rounded-md">
                        <p className="px-4 py-3 border-b-2 border-gray-300 text-lg text-teal-600 font-bold">Update Your Profile</p>

                        <div className="p-4">
                            <div className="form-group">
                                <label htmlFor="oldPassword" className="form-label">First Name</label>
                                <Field
                                    type="password"
                                    id="oldPassword"
                                    className="form-control"
                                    name="oldPassword"
                                />
                                <ErrorMessage component="p" name="oldPassword" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Last Name</label>
                                <Field
                                    type="name"
                                    id="name"
                                    className="form-control"
                                    name="name"
                                />
                                <ErrorMessage component="p" name="name" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <Field
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    name="email"
                                />
                                <ErrorMessage component="p" name="email" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bio" className="form-label">Bio</label>
                                <Field
                                    type="text"
                                    id="bio"
                                    className="form-control"
                                    name="bio"
                                />
                                <ErrorMessage component="p" name="bio" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="birthDate" className="form-label">Date of birth</label>
                                <Field
                                    type="date"
                                    id="birthDate"
                                    className="form-control"
                                    name="birthDate"
                                />
                                <ErrorMessage component="p" name="birthDate" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="school" className="form-label">School</label>
                                <Field
                                    type="text"
                                    id="school"
                                    className="form-control"
                                    name="school"
                                />
                                <ErrorMessage component="p" name="school" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="college" className="form-label">College</label>
                                <Field
                                    type="text"
                                    id="college"
                                    className="form-control"
                                    name="college"
                                />
                                <ErrorMessage component="p" name="college" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="work" className="form-label">Work</label>
                                <Field
                                    type="text"
                                    id="work"
                                    className="form-control"
                                    name="work"
                                />
                                <ErrorMessage component="p" name="work" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="currentCity" className="form-label">Current City</label>
                                <Field
                                    type="text"
                                    id="currentCity"
                                    className="form-control"
                                    name="currentCity"
                                />
                                <ErrorMessage component="p" name="currentCity" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="homeTown" className="form-label">Home Town</label>
                                <Field
                                    type="text"
                                    id="homeTown"
                                    className="form-control"
                                    name="homeTown"
                                />
                                <ErrorMessage component="p" name="homeTown" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="relationship" className="form-label">Relationship</label>
                                <Field
                                    id="relationship"
                                    className="form-control"
                                    name="relationship"
                                    as="select"
                                >
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="In a relationship">In a relationship</option>
                                </Field>
                                <ErrorMessage component="p" name="relationship" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profileImage" className="form-label">Profile Image</label>
                                <Field
                                    type="text"
                                    id="profileImage"
                                    className="form-control"
                                    name="profileImage"
                                />
                                <ErrorMessage component="p" name="profileImage" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="coverImage" className="form-label">Cover Image</label>
                                <Field
                                    type="text"
                                    id="coverImage"
                                    className="form-control"
                                    name="coverImage"
                                />
                                <ErrorMessage component="p" name="coverImage" className="form-error" />
                            </div>

                        </div>
                        <div className="px-4 py-3 border-t-2 border-gray-300">
                            <button
                                type="submit"
                                className="btn btn-primary bg-teal-600 font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Please Wait..." : "Update Profile"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>


            <Formik
                onSubmit={handlePasswordChange}
                validationSchema={changePasswordSchema}
                initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="max-w-xl mx-auto my-8 bg-white border-2 border-gray-300 rounded-md">
                        <p className="px-4 py-3 border-b-2 border-gray-300 text-lg text-teal-600 font-bold">Change Password</p>

                        <div className="p-4">
                            <div className="form-group">
                                <label htmlFor="oldPassword" className="form-label">Old Password</label>
                                <Field
                                    type="password"
                                    id="oldPassword"
                                    className="form-control"
                                    name="oldPassword"
                                />
                                <ErrorMessage component="p" name="oldPassword" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                <Field
                                    type="password"
                                    id="newPassword"
                                    className="form-control"
                                    name="newPassword"
                                />
                                <ErrorMessage component="p" name="newPassword" className="form-error" />
                            </div>

                            <div className="">
                                <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                                <Field
                                    type="password"
                                    id="confirmNewPassword"
                                    className="form-control"
                                    name="confirmNewPassword"
                                />
                                <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                            </div>


                        </div>
                        <div className="px-4 py-3 border-t-2 border-gray-300">
                            <button
                                type="submit"
                                className="btn btn-primary bg-teal-600 font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Please Wait..." : "Change Password"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

            <div className="max-w-xl mx-auto my-8 bg-white border-2 border-gray-300 rounded-md">
                <p className="px-4 py-3 border-b-2 border-gray-300 text-lg text-red-600 font-bold">Delete Account</p>

                <div className="p-4 text-gray-600">
                    Are you sure you want to delete your account ? This action can not be un done. Once you delete your
                    account all your photos and post will be deleted too.

                </div>
                <div className="px-4 py-3 border-t-2 border-gray-300">
                    <button
                        type="submit"
                        className="btn btn-primary bg-red-600 font-semibold"
                        disabled={isDeleting}
                        onClick={handleDeleteProfile}
                    >
                        {isDeleting ? "Please Wait..." : "Delete Account"}
                    </button>
                </div>
            </div>


        </div>
    )
}