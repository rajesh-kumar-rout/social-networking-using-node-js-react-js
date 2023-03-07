import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { AuthContext } from "./Auth"
import Comment from "./Comment"
import Loader from "./Loader"

const demoComments = [{
    "id": 1,
    "user": {
        "firstName": "Margy",
        "lastName": "Drioli",
        "_id": "d"
    },
    "comment": "Unspecified injury of other extensor muscle, fascia and tendon at forearm level, unspecified arm, initial encounter"
}, {
    "id": 2,
    "user": {
        "firstName": "Junie",
        "lastName": "Earie",
        "_id": "d"
    },
    "comment": "Osteolysis, right thigh"
}, {
    "id": 3,
    "user": {
        "firstName": "Emmye",
        "lastName": "Demchen",
        "_id": "d"
    },
    "comment": "Bitten by dolphin, sequela"
}, {
    "id": 4,
    "user": {
        "firstName": "Marjie",
        "lastName": "Gaishson",
        "_id": "d"
    },
    "comment": "Insect bite (nonvenomous), left ankle"
}, {
    "id": 5,
    "user": {
        "firstName": "Cinderella",
        "lastName": "Agerskow",
        "_id": "63ee3fe5ec03c8068617004a"
    },
    "comment": "Puncture wound with foreign body, unspecified knee, subsequent encounter"
}, {
    "id": 6,
    "user": {
        "firstName": "Fanechka",
        "lastName": "Andrzejczak",
        "_id": "d"
    },
    "comment": "Basal cell carcinoma of skin of lower limb, including hip"
}, {
    "id": 7,
    "user": {
        "firstName": "Doralin",
        "lastName": "Sandaver",
        "_id": "63ee3fe5ec03c8068617004a"
    },
    "comment": "Other lymphoid leukemia, in relapse"
}, {
    "id": 8,
    "user": {
        "firstName": "Freedman",
        "lastName": "Siward",
        "_id": "d"
    },
    "comment": "Female infertility"
}, {
    "id": 9,
    "user": {
        "firstName": "Chelsy",
        "lastName": "McFeat",
        "_id": "d"
    },
    "comment": "Atherosclerosis of autologous vein bypass graft(s) of the extremities with rest pain, other extremity"
}, {
    "id": 10,
    "user": {
        "firstName": "Constantine",
        "lastName": "Rowcliffe",
        "_id": "d"
    },
    "comment": "Fall on or from playground slide, subsequent encounter"
}]

export default function CommentBox({ postId }) {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function fetchComments() {
        const { data } = await axios.get(`/posts/${postId}/comments`)

        setComments(data)

        setIsLoading(false)
    }

    async function handleAddComment(event) {
        event.preventDefault()

        const comment = event.target.comment.value.trim()

        if (comment.length === 0 || comment.length > 255) return toast.error("Comment must be within 1-255 characters")

        setIsLoading(true)

        await axios.post(`/posts/${postId}/comments`, { comment })

        fetchComments()
    }

    async function handleDeleteComment(commentId) {
        setIsLoading(true)

        await axios.delete(`/posts/${postId}/comments/${commentId}`)

        setComments(comments.filter(comment => comment._id !== commentId))

        setIsLoading(false)
    }

    useEffect(() => {
        fetchComments()
    }, [])

    return (
        <div className="comment-box">
            {isLoading ? (
                <div style={{ padding: "16px 16px 4px" }}>
                    <Loader />
                </div>
            ) : (
                <>
                    <div>
                        <p className="comment-form-title">Your comment</p>

                        <form onSubmit={handleAddComment}>
                            <textarea
                                className="form-control"
                                style={{ resize: "none" }}
                                name="comment"
                            />
                            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Save Comment</button>
                        </form>
                    </div>

                    {comments.map(comment => (
                        <Comment
                            comment={comment}
                            onDeleteComment={handleDeleteComment}
                            key={comment.id}
                        />
                    ))}
                </>
            )}
        </div>
    )
}