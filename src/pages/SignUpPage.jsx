import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import { object, string, ref } from "yup"
import axios from "../utils/axios"
import Footer from "../components/Footer"

const validationSchema = object().shape({
    name: string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must be within 30 characters")
        .required("Name is required"),

    email: string()
        .email("Invalid email")
        .trim()
        .max(30, "Email must be within 30 characters")
        .required("Email is required"),

    password: string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be within 20 characters")
        .required("Password is required"),

    confirmPassword: string()
        .required("Please confirm your password")
        .oneOf([ref("password")], "Password does not match"),
})

export default function SignUpPage() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            await axios.post("/auth/register", values)
            toast.success("Sign up successfull")
        } catch ({ response }) {
            console.log(response);
            response?.status === 409 && toast.error("Email already exists")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className="h-screen w-full bg-gray-200 py-8">
                    <Form className="max-w-2xl bg-white rounded-md mx-auto p-7 shadow-md">
                        <p className="text-center font-bold text-indigo-600 mb-6 text-2xl">Sign Up</p>

                        <div className="mb-5">
                            <label htmlFor="name" className="font-semibold mb-2 inline-block">Name</label>
                            <Field
                                type="text"
                                id="name"
                                name="name"
                                className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                              focus:border-indigo-600 focus:ring-indigo-600"
                            />
                            <ErrorMessage component="p" name="name" className="mt-1 text-sm font-semibold text-red-600" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="email" className="font-semibold mb-2 inline-block">Email</label>
                            <Field
                                type="email"
                                id="email"
                                className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                                focus:border-indigo-600 focus:ring-indigo-600"
                                name="email"
                            />
                            <ErrorMessage component="p" name="email" className="mt-1 text-sm font-semibold text-red-600" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="password" className="font-semibold mb-2 inline-block">Password</label>
                            <Field
                                type="password"
                                id="password"
                                className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                              focus:border-indigo-600 focus:ring-indigo-600"
                                name="password"
                            />
                            <ErrorMessage component="p" name="password" className="mt-1 text-sm font-semibold text-red-600" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="confirmPassword" className="font-semibold mb-2 inline-block">Confirm Password</label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                                focus:border-indigo-600 focus:ring-indigo-600"
                                name="confirmPassword"
                            />
                            <ErrorMessage component="p" name="confirmPassword" className="mt-1 text-sm font-semibold text-red-600" />
                        </div>

                        <div className="mb-5">
                            <button
                                type="submit"
                                className="px-4 py-2 w-full rounded-md text-center bg-indigo-600 text-white hover:bg-indigo-800
                                disabled:bg-indigo-400 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading..." : "Sign Up"}
                            </button>
                        </div>

                        <p className="text-center">Already have an account ? <Link className="underline text-indigo-600" to="/login">Login</Link></p>

                        <Footer />
                    </Form>
                </div>
            )}
        </Formik>
    )
}