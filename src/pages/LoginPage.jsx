import { ErrorMessage, Field, Form, Formik } from "formik"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { loginSchema } from "../utils/validationSchema"

export default function LoginPage() {
    const [searchParams] = useSearchParams()

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)
console.log('call');
        try {
            const { data } = await axios.post("/auth/login", values)

            localStorage.setItem("authToken", data.authToken)

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
                <Form style={{ maxWidth: 600, padding: 10, margin: "24px auto" }}>
                    <div className="card">
                        <p className="card-header card-title">Login</p>

                        <div className="card-body">
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
                                    className="btn btn-primary btn-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Loading..." : "Login"}
                                </button>
                            </div>

                            <center>
                                Do not have an account ? <Link to="/register" style={{ color: "var(--orange600)" }}>Register</Link>
                            </center>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}