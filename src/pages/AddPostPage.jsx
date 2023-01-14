import { ErrorMessage, Field, Form, Formik } from "formik"
import { useRef } from "react"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { getBase64 } from "../utils/functions"
import { addPostSchema } from "../utils/validationSchema"

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
            validationSchema={addPostSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className="form">
                    <p className="form-title">Add New Post</p>

                    <div className="form-group">
                        <label htmlFor="desc" className="form-label">Description</label>
                        <Field
                            id="desc"
                            className="form-control"
                            name="desc"
                            as="textarea"
                        />
                        <ErrorMessage component="p" className="form-error" name="desc" />
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