import { ErrorMessage, Field, Form, Formik } from "formik"
import { useRef } from "react"
import { MdCamera, MdCameraFront, MdOutlinePhotoAlbum, MdOutlinePhotoCamera, MdPhotoAlbum, MdPhotoCamera } from "react-icons/md"
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
                <div className="bg-white border-2 border-gray-300 rounded-md w-[600px] mx-auto my-8 p-4">
                    <div className="flex items-center gap-3">
                        <img className="w-10 h-10 object-cover rounded-full" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674375/ytm0vtt148wl59sfqeqk.jpg" alt="" />
                        <input className="bg-gray-100 border-2 focus:ring-2 focus:ring-teal-600 outline-none border-gray-300 p-2 rounded-md text-gray-800 w-full" placeholder="What's on your mind, Rajesh?" />
                    </div>
                    <div className="border-t-2 border-t-gray-200 flex items-center gap-2 mt-4 pt-4 justify-end">
                        {/* <MdPhotoAlbum className="text-green-600" size={24} />
                        <p className="text-gray-600 text-sm">Photo</p> */}
                        <button className="px-2 py-1 transition-all duration-300 hover:bg-green-800 focus:ring-2 focus:ring-offset-2 focus:ring-green-600 rounded bg-green-600 text-white font-semibold text-sm">Add Photo</button>
                        <button className="px-2 py-1 transition-all duration-300 hover:bg-indigo-800 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 rounded bg-indigo-600 text-white font-semibold text-sm">Save</button>
                    </div>
                </div>
                // <Form className="bg-white border-2 border-gray-300 rounded-md max-w-lg mx-auto my-8">
                //     <p className="text-lg font-bold uppercase border-b-2 border-gray-300 px-4 py-3 text-center text-indigo-600">Add New Post</p>

                //     <div className="p-4">
                //     <div className="mb-5">
                //         <label htmlFor="desc" className="form-label">Description</label>
                //         <Field
                //             id="desc"
                //             className="form-control"
                //             name="desc"
                //             as="textarea"
                //         />
                //         <ErrorMessage component="p" className="form-error" name="desc" />
                //     </div>

                //     <div className="form-group">
                //         <label htmlFor="img" className="form-label">Image</label>
                //         {/* <input
                //             type="file"
                //             id="img"
                //             className="form-control"
                //             name="img"
                //             onChange={event => setFieldValue("img", event.target.files[0])}
                //             accept="image/jpg, image/jpeg, image/png"
                //             ref={imgRef}
                //         /> */}
                //         <div className="h-28 w-28 border-2 border-gray-300 rounded mt-1 bg-gray-100 text-gray-600 flex items-center justify-center">
                //             <MdPhotoCamera size={40}/>
                //         </div>
                //     </div>

                //     <button
                //         type="submit"
                //         className="btn btn-primary w-full"
                //         disabled={isSubmitting}
                //     >
                //         {isSubmitting ? "Loading..." : "Save"}
                //     </button>
                //     </div>
                // </Form>
            )}
        </Formik>
    )
}