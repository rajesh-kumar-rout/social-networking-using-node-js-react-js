import { useContext, useRef } from "react"
import { AuthContext } from "../components/Auth"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import { object, string } from "yup"
import { getBase64 } from "../utils/functions"
import axios from "../utils/axios"

const validationSchema = object().shape({
    name: string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must be within 30 characters")
        .required("Name is required"),

    email: string()
        .email("Invalid email")
        .trim()
        .max(30, "Email must be within 30 characters")
        .required("Email is required")
})

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
                profileImgUrl: data.profileImgUrl,
                coverImgUrl: data.coverImgUrl
            })
            profileImgRef.current.value = ""
            coverImgRef.current.value = ""
            values.profileImg = ""
            values.coverImg = ""
            toast.success("Account edited successfully")
        } catch ({ response }) {
            console.log(response);
            response?.status === 422 && toast.error("Email already taken")
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
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, isSubmitting }) => (
                <Form className="max-w-2xl bg-white shadow-md rounded-md my-8 mx-auto p-7">
                    <p className="text-center font-bold text-indigo-600 mb-6 text-2xl">Edit Account</p>

                    <div className="mb-5">
                        <label htmlFor="name" className="font-semibold mb-2 inline-block">Name</label>
                        <Field
                            type="text"
                            id="name"
                            className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                            focus:border-indigo-600  focus:ring-indigo-600"
                            name="name"
                        />
                        <ErrorMessage component="p" name="name" className="text-sm mt-1 font-semibold text-red-600" />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="email" className="font-semibold mb-2 inline-block">Email</label>
                        <Field
                            type="email"
                            id="email"
                            className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                            focus:border-indigo-600  focus:ring-indigo-600"
                            name="email"
                        />
                        <ErrorMessage component="p" name="email" className="text-sm mt-1 font-semibold text-red-600" />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="profileImg" className="font-semibold mb-2 inline-block">Profile Image</label>
                        <input
                            type="file"
                            id="profileImg"
                            className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                            focus:border-indigo-600  focus:ring-indigo-600"
                            name="profileImg"
                            onChange={event => setFieldValue("profileImg", event.target.files[0])}
                            ref={profileImgRef}
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="coverImg" className="font-semibold mb-2 inline-block">Cover Image</label>
                        <input
                            type="file"
                            id="coverImg"
                            name="coverImg"
                            className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                            focus:border-indigo-600  focus:ring-indigo-600"
                            onChange={event => setFieldValue("coverImg", event.target.files[0])}
                            ref={coverImgRef}
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 w-full rounded-md text-center bg-indigo-600 text-white hover:bg-indigo-800
                        disabled:bg-indigo-400 transition-all duration-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Loading..." : "Save"}
                    </button>
                </Form>
            )}
        </Formik>
    )
}