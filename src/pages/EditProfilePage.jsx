import { ErrorMessage, Field, Form, Formik } from "formik"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { changePasswordSchema } from "../utils/validationSchema"

export default function EditProfilePage() {

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        setSubmitting(true)

        try {
            await axios.patch("/auth/change-password", values)

            resetForm()

            toast.success("Password changed successfully")

        } catch ({ response }) {

            response?.status === 422 && toast.error("Old password does not match")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            }}
            validationSchema={changePasswordSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <>
                
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
                            <label htmlFor="newPassword" className="form-label">Last Name</label>
                            <Field
                                type="password"
                                id="newPassword"
                                className="form-control"
                                name="newPassword"
                            />
                            <ErrorMessage component="p" name="newPassword" className="form-error" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmNewPassword" className="form-label">Email</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                name="confirmNewPassword"
                            />
                            <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmNewPassword" className="form-label">Date of birth</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                name="confirmNewPassword"
                            />
                            <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword" className="form-label">School</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                name="confirmNewPassword"
                            />
                            <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword" className="form-label">College</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                name="confirmNewPassword"
                            />
                            <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword" className="form-label">Work</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                name="confirmNewPassword"
                            />
                            <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword" className="form-label">Current Location</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                name="confirmNewPassword"
                            />
                            <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword" className="form-label">Permanent Location</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                name="confirmNewPassword"
                            />
                            <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                        </div>
                        <div className="">
                            <label htmlFor="confirmNewPassword" className="form-label">Relationship</label>
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
                            {isSubmitting ? "Please Wait..." : "Update Profile"}
                        </button>
                        </div>
                </Form>

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

                <Form className="max-w-xl mx-auto my-8 bg-white border-2 border-gray-300 rounded-md">
                    <p className="px-4 py-3 border-b-2 border-gray-300 text-lg text-red-600 font-bold">Delete Account</p>

                    <div className="p-4 text-gray-600">
                        Are you sure you want to delete your account ? This action can not be un done. Once you delete your
                        account all your photos and post will be deleted too.
      
                    </div>
                    <div className="px-4 py-3 border-t-2 border-gray-300">
                        <button
                            type="submit"
                            className="btn btn-primary bg-red-600 font-semibold"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Please Wait..." : "Change Password"}
                        </button>
                        </div>
                </Form>
                </>
            )}
        </Formik>
    )
}