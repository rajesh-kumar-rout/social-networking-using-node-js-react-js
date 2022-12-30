import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import * as Yup from "yup"

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
        .min(6, "Invalid old password")
        .max(20, "Invalid old password")
        .required("Old password is required"),

    newPassword: Yup.string()
        .min(6, "New password must be at least 6 characters")
        .max(20, "New password must be within 20 characters")
        .required("New password is required"),

    confirmNewPassword: Yup.string()
        .required("Please confirm your new password")
        .oneOf([Yup.ref("newPassword")], "New password does not match"),
})

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
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="card card-2">
                    <p className="card-header card-title-1">Change Password</p>

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
                            className="btn btn-primary btn-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Please Wait..." : "Change Password"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}