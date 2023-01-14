import { ErrorMessage, Field, Form, Formik } from "formik"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { changePasswordSchema } from "../utils/validationSchema"

export default function ChangePasswordPage() {

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
                <Form className="form">
                    <p className="form-title">Change Password</p>

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

                    <div className="form-group">
                        <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                        <Field
                            type="password"
                            id="confirmNewPassword"
                            className="form-control"
                            name="confirmNewPassword"
                        />
                        <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Please Wait..." : "Change Password"}
                    </button>
                </Form>
            )}
        </Formik>
    )
}