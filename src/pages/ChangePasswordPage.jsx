import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import { object, string, ref } from "yup"
import axios from "../utils/axios"

const validationSchema = object().shape({
    oldPassword: string()
        .min(6, "Invalid old password")
        .max(20, "Invalid old password")
        .required("Old password is required"),

    newPassword: string()
        .min(6, "New password must be at least 6 characters")
        .max(20, "New password must be within 20 characters")
        .required("New password is required"),

    confirmNewPassword: string()
        .required("Please confirm your new password")
        .oneOf([ref("newPassword")], "New password does not match"),
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
                <Form className="max-w-2xl bg-white shadow-md rounded-md my-8 mx-auto p-7">
                    <p className="text-center font-bold text-indigo-600 mb-6 text-2xl">Change Password</p>

                    <div className="form-group">
                        <label htmlFor="oldPassword" className="font-semibold mb-2 inline-block">Old Password</label>
                        <Field
                            type="password"
                            id="oldPassword"
                            className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                            focus:border-indigo-600  focus:ring-indigo-600"
                            name="oldPassword"
                        />
                        <ErrorMessage component="p" name="oldPassword" className="text-sm mt-1 font-semibold text-red-600" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword" className="font-semibold mb-2 inline-block">New Password</label>
                        <Field
                            type="password"
                            id="newPassword"
                            className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                            focus:border-indigo-600  focus:ring-indigo-600"
                            name="newPassword"
                        />
                        <ErrorMessage component="p" name="newPassword" className="text-sm mt-1 font-semibold text-red-600" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmNewPassword" className="font-semibold mb-2 inline-block">Confirm New Password</label>
                        <Field
                            type="password"
                            id="confirmNewPassword"
                            className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                            focus:border-indigo-600  focus:ring-indigo-600"
                            name="confirmNewPassword"
                        />
                        <ErrorMessage component="p" name="confirmNewPassword" className="text-sm mt-1 font-semibold text-red-600" />
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 w-full rounded-md text-center bg-indigo-600 text-white hover:bg-indigo-800
                        disabled:bg-indigo-400 transition-all duration-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Please Wait..." : "Change Password"}
                    </button>
                </Form>
            )}
        </Formik>
    )
}