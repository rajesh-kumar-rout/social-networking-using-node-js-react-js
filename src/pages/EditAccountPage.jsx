import { ErrorMessage, Field, Form, Formik } from "formik"
import { useContext, useRef } from "react"
import { toast } from "react-toastify"
import { AuthContext } from "../components/Auth"
import axios from "../utils/axios"
import { getBase64 } from "../utils/functions"
import { editAccountSchema } from "../utils/validationSchema"

export default function ChangePasswordPage() {
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const profileImgRef = useRef()
    const coverImgRef = useRef()

    const handleSubmit = async (values, { setSubmitting }) => {
        values.profileImg && (values.profileImg = await getBase64(values.profileImg))
        values.coverImg && (values.coverImg = await getBase64(values.coverImg))

        setSubmitting(true)

        try {
            const { data } = await axios.patch("/auth/edit-account", values)

            setCurrentUser({
                ...currentUser,
                name: values.name,
                email: values.email,
                profileImgUrl: data.profileImgUrl,
                coverImgUrl: data.coverImgUrl
            })

            profileImgRef.current.value = ""
            coverImgRef.current.value = ""

            values.profileImg = ""
            values.coverImg = ""

            toast.success("Account edited successfully")

        } catch ({ response }) {

            response?.status === 409 && toast.error("Email already taken")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                name: currentUser.name,
                email: currentUser.email,
                profileImg: "",
                coverImg: ""
            }}
            validationSchema={editAccountSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, isSubmitting }) => (
                <Form className="form">
                    <p className="form-title">Edit Account</p>

                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <Field
                            type="text"
                            id="name"
                            className="form-control"
                            name="name"
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
                        <label htmlFor="profileImg" className="form-label">Profile Image</label>
                        <input
                            type="file"
                            id="profileImg"
                            className="form-control"
                            name="profileImg"
                            onChange={event => setFieldValue("profileImg", event.target.files[0])}
                            ref={profileImgRef}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="coverImg" className="form-label">Cover Image</label>
                        <input
                            type="file"
                            id="coverImg"
                            name="coverImg"
                            className="form-control"
                            onChange={event => setFieldValue("coverImg", event.target.files[0])}
                            ref={coverImgRef}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Loading..." : "Save"}
                    </button>
                </Form>
            )}
        </Formik>
    )
}