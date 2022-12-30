import { useRef } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import * as Yup from "yup"

const validationSchema = Yup.object().shape({
    desc: Yup.string()
        .trim()
        .max(255, "Description must be within 255 characters")
        .when("img", {
            is: (img) => img === undefined,
            then: Yup.string().required("Either image or description required")
        })
})

export default function AddPostPage() {
    const imgRef = useRef()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const formData = new FormData()
        Object.keys(values).forEach(key => formData.append(key, values[key]))

        setSubmitting(true)

        await axios.post("/posts", formData)
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
                <Form className="card card-2">
                    <div className="card-header card-title-1">Add New Post</div>

                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="desc" className="form-label">Description</label>
                            <Field
                                id="desc"
                                className="form-control"
                                name="desc"
                                as="textarea"
                            />
                            <ErrorMessage component="p" className="form-error" name="desc"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="img" className="form-label">Image</label>
                            <input
                                type="file"
                                id="img"
                                className="form-control"
                                name="img"
                                onChange={event => setFieldValue("img", event.target.files[0])}
                                accept="image/jpg, image/jpeg, image/png"
                                ref={imgRef}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Please Wait..." : "Save"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}