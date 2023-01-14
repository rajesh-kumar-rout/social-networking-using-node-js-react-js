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
                    <Form className="form">
                        <p className="form-title">Login</p>

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

                        <p className="text-center">Do not have an account ? <Link to="/sign-up" className="underline text-indigo-600">Sign Up</Link></p>

                        <Footer />
                    </Form>
                </div>
            )}
        </Formik>
    )
}