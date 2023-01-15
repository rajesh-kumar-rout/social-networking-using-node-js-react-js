import { ErrorMessage, Field, Form, Formik } from "formik"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import Footer from "../components/Footer"
import axios from "../utils/axios"
import { loginSchema } from "../utils/validationSchema"

export default function LoginPage() {
    const [searchParams] = useSearchParams()

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.post("/auth/login", values)

            localStorage.setItem("token", data.token)

            window.location.href = searchParams.get("returnUrl") ? searchParams.get("returnUrl") : "/"

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
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className="h-screen w-full bg-gray-200 py-8">
                    <Form className="bg-white rounded-md overflow-hidden lg:grid grid-cols-2 max-w-4xl mx-auto">
                        <div className="relative hidden lg:block">
                            <img src="https://cdn.pixabay.com/photo/2015/01/08/18/25/desk-593327__340.jpg" className="object-cover h-full w-full" alt="" />

                            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        </div>
                        <div className="p-6">
                            <p className="text-teal-600 font-bold text-lg mb-6">Login</p>

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
                                <label htmlFor="password" className="form-label">Password</label>
                                <Field
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    name="password"
                                />
                                <ErrorMessage component="p" name="password" className="form-error" />
                            </div>

                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Loading..." : "Login"}
                                </button>
                            </div>

                            <p className="text-center text-gray-700">Do not have an account ? <Link to="/sign-up" className=" text-teal-600">Register</Link></p>
                            {/* <a href="" className="font-bold text-teal-600 text-center block">Register</a> */}

                        </div>
                        <Footer />
                    </Form>
                </div>
            )}
        </Formik>
    )
}