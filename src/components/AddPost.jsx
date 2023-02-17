import { Field, Form, Formik } from "formik"
import { useContext } from "react"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { DEFAULT_PROFILE_IMG } from "../utils/constants"
import { handleImage } from "../utils/functions"
import { AuthContext } from "./Auth"

export default function AddPost({ onAddPost }) {
    const { currentUser } = useContext(AuthContext)

    const handleSubmit = async(values, {setSubmitting, resetForm}) => {
        setSubmitting(true)

        await axios.post("/posts", values)

        resetForm()

        setSubmitting(false)

        toast.success("Post created successfully")
    }

    return (
        <Formik
            initialValues={{
                image: "",
                description: "",
                videoUrl: "",
                type: ""
            }}
            onSubmit={onAddPost}
        >
            {({ isSubmitting, values, setFieldValue }) => (
                <Form className="add-post">
                    <div className="add-post-header">
                        <img className="add-post-img" src={currentUser.profileImage ? currentUser.profileImage.url : DEFAULT_PROFILE_IMG} alt="" />

                        <div className="add-post-right">
                            <Field
                                name="description"
                                className="form-control"
                                style={{ resize: "none" }}
                                as="textarea"
                                placeholder={`What's on your mind, ${currentUser.firstName}?`}
                            />

                            {values.type === "image" && (
                                <input
                                    type="file"
                                    name="image"
                                    className="form-control"
                                    style={{ marginTop: 4 }}
                                    onChange={event => handleImage(event, setFieldValue)}
                                    placeholder="Enter video link"
                                />
                            )}

                            {values.type === "video" && (
                                <Field
                                    type="text"
                                    name="videoUrl"
                                    className="form-control"
                                    style={{ marginTop: 4 }}
                                    placeholder="Youtube video link"
                                />
                            )}
                        </div>
                    </div>

                    <div className="add-post-footer">
                        {values.type === "video" ? (
                            <button type="button" className="btn btn-sm btn-danger" onClick={() => setFieldValue("type", "")}>
                                Remove Video
                            </button>
                        ) : (
                            <button type="button" className="btn btn-sm btn-danger" onClick={() => setFieldValue("type", "video")}>
                                Add Video
                            </button>
                        )}

                        {values.type === "image" ? (
                            <button type="button" className="btn btn-sm btn-success" onClick={() => setFieldValue("type", "")}>
                                Remove Photo
                            </button>
                        ) : (
                            <button type="button" className="btn btn-sm btn-success" onClick={() => setFieldValue("type", "image")}>
                                Add Photo
                            </button>
                        )}

                        <button className="btn btn-sm btn-primary" type="submit" disabled={isSubmitting}>Save</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}