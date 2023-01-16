import { ErrorMessage, Field, Form, Formik } from "formik"
import { useRef, useState } from "react"
import { MdCamera, MdCameraFront, MdOutlinePhotoAlbum, MdOutlinePhotoCamera, MdPhotoAlbum, MdPhotoCamera } from "react-icons/md"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { getBase64 } from "../utils/functions"
import { addPostSchema } from "../utils/validationSchema"

export default function AddPostPage() {
    const imgRef = useRef()
    const [postType, setPostType] = useState()

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
                <div className="bg-white border-2 border-x-0 post:border-x-2 border-gray-300 rounded-md w-full post:w-[600px] mx-auto my-8 p-4">
                    <div className="flex items-start gap-3">
                        <img className="w-10 h-10 object-cover rounded-full" src="https://res.cloudinary.com/dhyc0vsbz/image/upload/w_510,h_360,c_fill/v1673674375/ytm0vtt148wl59sfqeqk.jpg" alt="" />
                        <div className="flex-1">
                        <textarea name="desc" className="bg-gray-100 resize-none border-2 focus:ring-1 focus:border-teal-600 focus:ring-teal-600 
                        outline-none border-gray-300 p-2 rounded-md text-gray-800 w-full" placeholder="What's on your mind, Rajesh?" />
                        
                        {postType === "photo" && <input type="file" name="img" className="bg-gray-100 resize-none border-2 focus:ring-2 focus:ring-teal-600 outline-none
                         border-gray-300 p-2 rounded-md text-gray-800 w-full mt-2" placeholder="Enter video link" />}
                        
                        {postType === "video" && <input type="text" name="video"  className="bg-gray-100 resize-none border-2 focus:ring-2 focus:ring-teal-600 outline-none
                         border-gray-300 p-2 rounded-md text-gray-800 w-full mt-2" placeholder="Youtube video link" />}
                        </div>
                    
                    </div>
                    <div className="border-t-2 border-t-gray-200 flex items-center gap-2 mt-4 pt-4 justify-end">
                        {/* <MdPhotoAlbum className="text-green-600" size={24} />
                        <p className="text-gray-600 text-sm">Photo</p> */}
                        {postType === "video" ? (
                            <button className="px-2 py-1 transition-all duration-300 hover:bg-yellow-800 focus:ring-2 
                            focus:ring-offset-2 focus:ring-yellow-600 rounded bg-yellow-600 text-white font-semibold 
                            text-sm" onClick={() => setPostType()}>Remove Video</button>
                        ) : (
                            <button className="px-2 py-1 transition-all duration-300 hover:bg-yellow-800 focus:ring-2 
                            focus:ring-offset-2 focus:ring-yellow-600 rounded bg-yellow-600 text-white font-semibold 
                            text-sm" onClick={() => setPostType("video")}>Add Video</button>
                        )}

                        {postType === "photo" ? (
                            <button className="px-2 py-1 transition-all duration-300 hover:bg-purple-800 focus:ring-2 
                        focus:ring-offset-2 focus:ring-purple-600 rounded bg-purple-600 text-white font-semibold 
                        text-sm" onClick={() => setPostType()}>Remove Photo</button>
                        ) : (
                            <button className="px-2 py-1 transition-all duration-300 hover:bg-purple-800 focus:ring-2 
                        focus:ring-offset-2 focus:ring-purple-600 rounded bg-purple-600 text-white font-semibold 
                        text-sm" onClick={() => setPostType("photo")}>Add Photo</button>
                        )}

                        <button className="px-2 py-1 transition-all duration-300 hover:bg-teal-800 focus:ring-2 
                        focus:ring-offset-2 focus:ring-teal-600 rounded bg-indigo-600 text-white 
                        font-semibold text-sm">Save</button>
                    </div>
                </div>
                // <Form className="max-w-xl mx-auto my-8 bg-white border-2 border-gray-300 rounded-md">
                //     <p className="px-4 py-3 border-b-2 border-gray-300 text-lg text-teal-600 font-bold text-center">Add New Post</p>

                //     <div className="p-4">
                //         <div className="form-group">
                //             <label htmlFor="oldPassword" className="form-label">What's on your mind</label>
                //             <Field
                //                 type="password"
                //                 id="oldPassword"
                //                 className="form-control"
                //                 name="oldPassword"
                //             />
                //             <ErrorMessage component="p" name="oldPassword" className="form-error" />
                //         </div>

                //         <div className="form-group">
                //             <label htmlFor="newPassword" className="form-label">Post Type</label>
                //             <select name="" id="" className="form-control">
                //                 <option value="1"></option>
                //                 <option value="1">Video</option>
                //                 <option value="1">Photo</option>
                //             </select>
                //             <ErrorMessage component="p" name="newPassword" className="form-error" />
                //         </div>

                //         <div className="form-group">
                //             <label htmlFor="confirmNewPassword" className="form-label">Image</label>
                //             <Field
                //                 type="text"
                //                 id="confirmNewPassword"
                //                 className="form-control"
                //                 name="confirmNewPassword"
                //             />
                //             <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                //         </div>

                //         <div className="">
                //             <label htmlFor="confirmNewPassword" className="form-label">Youtube video link</label>
                //             <Field
                //                 type="password"
                //                 id="confirmNewPassword"
                //                 className="form-control"
                //                 name="confirmNewPassword"
                //             />
                //             <ErrorMessage component="p" name="confirmNewPassword" className="form-error" />
                //         </div>
                        


                //     </div>
                //     <div className="px-4 py-3 border-t-2 border-gray-300">
                //         <button
                //             type="submit"
                //             className="btn btn-primary bg-teal-600 font-semibold w-full"
                //             disabled={isSubmitting}
                //         >
                //             {isSubmitting ? "Please Wait..." : "Save"}
                //         </button>
                //     </div>
                // </Form>
            )}
        </Formik>
    )
}