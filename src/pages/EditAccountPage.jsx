import { useContext } from "react"
import { AccountContext } from "../components/Account"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import * as Yup from "yup"

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must be within 30 characters")
        .required("Name is required")
})

export default function ChangePasswordPage() {
    const { account, setAccount } = useContext(AccountContext)

    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = new FormData()
        Object.keys(values).forEach(key => formData.append(key, values[key]))

        setSubmitting(true)

        try {
            const { data } = await axios.patch("/auth/edit-account", formData)
            setAccount({
                ...account,
                name: values.name,
                profileImgUrl: data.profileImgUrl,
                coverImgUrl: data.coverImgUrl
            })
            toast.success("Account edited successfully")
        } catch ({ response }) {
            response?.status === 422 && toast.error("Email already taken")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                name: account.name,
                email: account.email,
                profileImg: "",
                coverImg: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, isSubmitting }) => (
                <Form className="card card-2">
                    <div className="card-header card-title-1">Edit Account</div>

                    <div className="card-body">
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
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="profileImg" className="form-label">Profile Image</label>
                            <input
                                type="file"
                                id="profileImg"
                                className="form-control"
                                name="profileImg"
                                onChange={event => setFieldValue("profileImg", event.target.files[0])}
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
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Please wait..." : "Save"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}