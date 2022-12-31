import { useRef } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import { object, string } from "yup"
import { getBase64 } from "../utils/functions"
import axios from "../utils/axios"

const validationSchema = object().shape({
    desc: string()
        .trim()
        .max(255, "Description must be within 255 characters")
        .when("img", {
            is: (img) => img === undefined,
            then: string().required("Either image or description required")
        })
})

export default function AddPostPage() {
    const imgRef = useRef()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        values.img && (values.img = await getBase64(values.img))
        setSubmitting(true)
        await axios.post("/posts", values)
        resetForm()
        imgRef.current.value = ""
        toast.success("Post added successfully")
        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                desc: "",
                img: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className="max-w-2xl bg-white border-2 border-gray-300 rounded-md my-8 mx-auto p-7">
                    <p className="text-center font-bold text-indigo-600 mb-6 text-2xl">Add New Post</p>

                    <div className="">
                        <div className="mb-5">
                            <label htmlFor="desc" className="font-semibold mb-2 inline-block">Description</label>
                            <Field
                                id="desc"
                                className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                                focus:border-indigo-600  focus:ring-indigo-600"
                                name="desc"
                                as="textarea"
                            />
                            <ErrorMessage component="p" className="text-sm mt-1 font-semibold text-red-600" name="desc" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="img" className="font-semibold mb-2 inline-block">Image</label>
                            <input
                                type="file"
                                id="img"
                                className="border-2 border-gray-300 rounded-md p-2 outline-none block w-full focus:ring-1
                                focus:border-indigo-600  focus:ring-indigo-600"
                                name="img"
                                onChange={event => setFieldValue("img", event.target.files[0])}
                                accept="image/jpg, image/jpeg, image/png"
                                ref={imgRef}
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
                    </div>
                </Form>
            )}
        </Formik>
    )
}