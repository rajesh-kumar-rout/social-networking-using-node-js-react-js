import { ErrorMessage, Field, Form, Formik } from "formik"
import moment from "moment"
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { AuthContext } from "../components/Auth"
import axios from "../utils/axios"
import { handleImage } from "../utils/functions"
import { changePasswordSchema, editProfileSchema } from "../utils/validationSchema"

export default function EditProfilePage() {
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleProfileUpdate = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.patch("/auth/edit-profile", values)

            setCurrentUser(data)

            toast.success("Profile updated successfully")

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

    const handleDeleteProfile = async () => {
        setIsDeleting(true)

        await axios.delete("/auth")

        toast.success("Account deleted succesfully")

        window.location.href = "/login"

        setIsDeleting(false)
    }

    return (
        <div>
            <Formik
                initialValues={{
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    bio: currentUser.bio,
                    email: currentUser.email,
                    school: currentUser.school,
                    college: currentUser.college,
                    work: currentUser.work,
                    homeTown: currentUser.homeTown,
                    currentCity: currentUser.currentCity,
                    gender: currentUser.gender,
                    relationship: currentUser.relationship,
                    birthDate: moment(currentUser.birthDate).format("YYYY-MM-DD"),
                    profileImage: "",
                    coverImage: ""
                }}
                validationSchema={editProfileSchema}
                onSubmit={handleProfileUpdate}
            >
                {({ isSubmitting, setFieldValue, handleBlur }) => (
                    <Form className="card" style={{ maxWidth: 700, margin: "auto" }}>
                        <p className="card-header card-title">Edit Personal Info</p>

                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="firstName" className="form-label form-label-required">First Name</label>
                                <Field
                                    type="text"
                                    id="firstName"
                                    className="form-control"
                                    name="firstName"
                                />
                                <ErrorMessage component="p" name="firstName" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <Field
                                    type="text"
                                    id="lastName"
                                    className="form-control"
                                    name="lastName"
                                />
                                <ErrorMessage component="p" name="lastName" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label form-label-required">Email</label>
                                <Field
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    name="email"
                                />
                                <ErrorMessage component="p" name="email" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio" className="form-label form-label-required">Bio</label>
                                <Field
                                    type="text"
                                    id="bio"
                                    className="form-control"
                                    name="bio"
                                    as="textarea"
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
                                    max={moment().subtract(10, "years").format("YYYY-MM-DD")}
                                />
                                <ErrorMessage component="p" name="birthDate" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">Gender</label>

                                <div className="form-radio">
                                    <Field
                                        type="radio"
                                        id="male"
                                        className=" form-radio-input"
                                        name="gender"
                                        value="Male"
                                    />
                                    <label htmlFor="male">Male</label>
                                </div>

                                <div className="form-radio" style={{ marginTop: 8 }}>
                                    <Field
                                        type="radio"
                                        id="female"
                                        className="form-radio-input"
                                        name="gender"
                                        value="Female"
                                    />
                                    <label htmlFor="female">Female</label>
                                </div>
                                
                                <ErrorMessage component="p" name="gender" className="form-error" />
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
                            </div>

                            <div className="form-group">
                                <label htmlFor="profileImage" className="form-label">Profile Image</label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    className="form-control"
                                    name="profileImage"
                                    onBlur={handleBlur}
                                    onChange={event => handleImage(event, setFieldValue)}
                                    accept=".jpeg, .jpg, png"
                                />
                            </div>

                            <div>
                                <label htmlFor="coverImage" className="form-label">Cover Image</label>
                                <input
                                    type="file"
                                    id="coverImage"
                                    className="form-control"
                                    name="coverImage"
                                    onBlur={handleBlur}
                                    onChange={event => handleImage(event, setFieldValue)}
                                    accept=".jpeg, .jpg, png"
                                />
                            </div>
                        </div>

                        <div className="card-footer">
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
                    <Form className="card" style={{ maxWidth: 700, margin: "auto", marginTop: 36 }}>
                        <p className="card-header card-title">Change Password</p>

                        <div className="card-body">
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

                            <div>
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

                        <div className="card-footer">
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

            <div className="card" style={{ maxWidth: 700, margin: "auto", marginTop: 36 }}>
                <p className="card-header card-title">Delete Account</p>

                <div className="card-body">
                    Are you sure you want to delete your account ? This action can not be un done. Once you delete your
                    account all your photos and post will be deleted too.
                </div>

                <div className="card-footer">
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