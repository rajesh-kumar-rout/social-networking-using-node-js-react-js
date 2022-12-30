import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import Footer from "../components/Footer"
import * as Yup from "yup"

const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),

    password: Yup.string().required("Password is required")
})

export default function LoginPage() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.post("/auth/login", values)
            localStorage.setItem("jwtToken", data.jwtToken)
            navigate("/")
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
                <Form className="card card-2">
                    <p className="card-header card-title-1">Login</p>

                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Field
                                type="email"
                                id="email"
                                className="form-control"
                                name="email"
                            />
                            <ErrorMessage component="p" name="email" className="form-error"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Field
                                type="password"
                                id="password"
                                className="form-control"
                                name="password"
                            />
                            <ErrorMessage component="p" name="password" className="form-error"/>
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Please Wait..." : "Login"}
                            </button>
                        </div>

                        <p className="text-center">Do not have an account ? <Link to="/sign-up">Sign Up</Link></p>
                    </div>

                    <Footer />
                </Form>
            )}
        </Formik>
    )
}