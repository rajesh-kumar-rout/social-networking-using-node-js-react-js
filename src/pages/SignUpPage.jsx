import { ErrorMessage, Field, Form, Formik } from "formik"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import Footer from "../components/Footer"
import axios from "../utils/axios"
import { signUpSchema } from "../utils/validationSchema"

export default function SignUpPage() {

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.post("/auth/register", values)

            localStorage.setItem("token", data.token)

            toast.success("Sign up successfull")

            window.location.href = "/"

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
            validationSchema={signUpSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <div className="h-screen w-full overflow-y-auto bg-gray-200 py-8">
                    <Form className="bg-white border-2 border-gray-300 rounded-md max-w-xl mx-auto">
                        <p className="border-b-2 border-gray-300 px-4 py-3 text-center text-lg font-bold text-teal-600">Register</p>

                        <div className="p-4">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">First Name</label>
                                <Field
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                />
                                <ErrorMessage component="p" name="name" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Last Name</label>
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
                                <label htmlFor="email" className="form-label">Date of birth</label>
                                <Field
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    name="email"
                                />
                                <ErrorMessage component="p" name="email" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Gender</label>
                                <div className="space-y-2 flex gap-6 ">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id="email"
                                            className="w-4 h-4 text-teal-600"
                                            name="email"
                                            as="radio"
                                        />
                                        <label htmlFor="">Male</label>

                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id="email"
                                            className="w-4 h-4 text-teal-600"
                                            name="email"
                                            as="radio"
                                        />
                                        <label htmlFor="">Female</label>

                                    </div>
                                </div>
                                <ErrorMessage component="p" name="email" className="form-error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Work</label>
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
                                    className="btn btn-primary w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Loading..." : "Sign Up"}
                                </button>
                            </div>

                            <p className="text-center text-gray-700">Already have an account ?
                                <Link className=" text-teal-600" to="/login"> Login</Link></p>
                        </div>



                        {/* <Footer /> */}
                    </Form>
                </div>
            )}
        </Formik>
    )
}