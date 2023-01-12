import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import { object, string } from "yup"
import axios from "../utils/axios"
import Footer from "../components/Footer"

const validationSchema = object().shape({
    email: string().required("Email is required"),

    password: string().required("Password is required")
})

export default function LoginPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
console.log(searchParams.get("returnUrl"));
    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.post("/auth/login", values)
            window.location.href = "/"
        } catch ({ response }) {
            response?.status === 422 && toast.error("Invalid email or password")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className="h-screen w-full bg-gray-200 py-8">
                    <Form className="max-w-2xl bg-white rounded-md mx-auto p-7 shadow-md">
                        <p className="text-center font-bold text-indigo-600 mb-6 text-2xl">Login</p>

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
                            <button
                                type="submit"
                                className="px-4 py-2 w-full rounded-md text-center bg-indigo-600 text-white hover:bg-indigo-800
                                disabled:bg-indigo-400 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading..." : "Login"}
                            </button>
                        </div>

                        <p className="text-center">Do not have an account ? <Link to="/sign-up" className="underline text-indigo-600">Sign Up</Link></p>

                        <Footer />
                    </Form>
                </div>
            )}
        </Formik>
    )
}