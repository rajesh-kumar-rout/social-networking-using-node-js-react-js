import { ErrorMessage, Field, Form, Formik } from "formik"
import moment from "moment"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { handleImage } from "../utils/functions"
import { registerSchema } from "../utils/validationSchema"

export default function RegisterPage() {

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
                firstName: "",
                lastName: "",
                bio: "",
                email: "",
                school: "",
                college: "",
                work: "",
                homeTown: "",
                currentCity: "",
                gender: "",
                relationship: "Single",
                birthDate: "",
                profileImage: "",
                coverImage: "",
                password: "",
                confirmPassword: ""
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue, handleBlur }) => (
                <div className="h-screen w-full overflow-y-auto bg-gray-200 py-8">
                    <Form className="bg-white border-2 border-gray-300 rounded-md max-w-xl mx-auto">
                        <p className="border-b-2 border-gray-300 px-4 py-3 text-center text-lg font-bold text-teal-600">Register</p>

                        <div className="p-4">
                            <div className="form-group">
                                <label htmlFor="firstName" className="form-label form-label-required">First Name</label>
                                <Field
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="form-control"
                                />
                                <ErrorMessage component="p" name="firstName" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <Field
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="form-control"
                                />
                                <ErrorMessage component="p" name="lastName" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio" className="form-label">Bio</label>
                                <Field
                                    type="text"
                                    id="bio"
                                    name="bio"
                                    className="form-control"
                                    as="textarea"
                                />
                                <ErrorMessage component="p" name="bio" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label form-label-required">Email</label>
                                <Field
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    name="email"
                                />
                                <ErrorMessage component="p" name="email" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="birthDate" className="form-label">Date of birth</label>
                                <Field
                                    type="date"
                                    id="birthDate"
                                    className="form-control"
                                    name="birthDate"
                                    max={moment().subtract(10, "years").format("YYYY-MM-DD")}
                                />
                                <ErrorMessage component="p" name="birthDate" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">Gender</label>

                                <div className="mt-1 flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <Field
                                            type="radio"
                                            id="male"
                                            className=" text-teal-600 focus:ring-teal-600"
                                            name="gender"
                                            value="Male"
                                        />
                                        <label htmlFor="male">Male</label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Field
                                            type="radio"
                                            id="female"
                                            className="text-teal-600 focus:ring-teal-600"
                                            name="gender"
                                            value="Female"
                                        />
                                        <label htmlFor="female">Female</label>
                                    </div>
                                </div>
                                <ErrorMessage component="p" name="gender" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="work" className="form-label">Work</label>
                                <Field
                                    type="text"
                                    id="work"
                                    className="form-control"
                                    name="work"
                                />
                                <ErrorMessage component="p" name="work" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="school" className="form-label">School</label>
                                <Field
                                    type="text"
                                    id="school"
                                    className="form-control"
                                    name="school"
                                />
                                <ErrorMessage component="p" name="school" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="college" className="form-label">College</label>
                                <Field
                                    type="text"
                                    id="college"
                                    className="form-control"
                                    name="college"
                                />
                                <ErrorMessage component="p" name="college" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="currentCity" className="form-label">Current City</label>
                                <Field
                                    type="text"
                                    id="currentCity"
                                    className="form-control"
                                    name="currentCity"
                                />
                                <ErrorMessage component="p" name="currentCity" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="homeTown" className="form-label">Home Town</label>
                                <Field
                                    type="text"
                                    id="homeTown"
                                    className="form-control"
                                    name="homeTown"
                                />
                                <ErrorMessage component="p" name="homeTown" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="relationship" className="form-label">Relationship</label>
                                <Field
                                    id="relationship"
                                    className="form-control"
                                    name="relationship"
                                    as="select"
                                >
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="In a relationship">In a relationship</option>
                                </Field>
                            </div>

                            <div className="form-group">
                                <label htmlFor="profileImage" className="form-label">Profile Image</label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    className="form-control"
                                    name="profileImage"
                                    onBlur={handleBlur}
                                    onChange={event => handleImage(event, setFieldValue)}
                                    accept=".jpeg, .jpg, .png"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="coverImage" className="form-label">Cover Image</label>
                                <input
                                    type="file"
                                    id="coverImage"
                                    className="form-control"
                                    name="coverImage"
                                    onBlur={handleBlur}
                                    onChange={event => handleImage(event, setFieldValue)}
                                    accept=".jpeg, .jpg, .png"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label form-label-required">Password</label>
                                <Field
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    name="password"
                                />
                                <ErrorMessage component="p" name="password" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label form-label-required">Confirm Password</label>
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

                            <p className="text-center text-gray-700">
                                Already have an account ?
                                <Link className=" text-teal-600" to="/login"> Login</Link>
                            </p>
                        </div>

                        {/* <Footer /> */}
                    </Form>
                </div>
            )}
        </Formik>
    )
}