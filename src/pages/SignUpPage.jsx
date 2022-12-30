import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import Footer from "../components/Footer"
import * as Yup from "yup"

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must be within 30 characters")
        .required("Name is required"),

    email: Yup.string()
        .email("Invalid email")
        .trim()
        .max(30, "Email must be within 30 characters")
        .required("Email is required"),

    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be within 20 characters")
        .required("Password is required"),

    confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Password does not match"),
})

export default function SignUpPage() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            await axios.post("/auth/sign-up", values)
            toast.success("Sign up successfull. Please login")
            navigate("/login")
        } catch ({ response }) {
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
                <Form className="card card-2">
                    <div className="card-header card-title-1">Sign Up</div>

                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name</label>
                            <Field
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                            />
                            <ErrorMessage component="p" name="name" className="form-error" />
                        </div>

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
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                name="confirmPassword"
                            />
                            <ErrorMessage component="p" name="confirmPassword" className="form-error" />
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Please Wait..." : "Sign Up"}
                            </button>
                        </div>

                        <p className="text-center">Already have an account ? <Link to="/login">Login</Link></p>
                    </div>

                    <Footer />
                </Form>
            )}
        </Formik>
    )
}