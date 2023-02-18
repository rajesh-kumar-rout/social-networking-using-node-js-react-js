import moment from "moment"

export function cloudiImgUrl(url) {

    if (url && url.startsWith("https://res.cloudinary.com/")) {

        return [
            url.split("upload/")[0],

            "upload/",

            "w_510,h_360,c_fill/",

            url.split("upload/")[1]
        ].join("")
    }

    return url
}

export const dateToAgo = (date) => {
    const format = moment(date).fromNow()
    return format.charAt(0).toUpperCase() + format.slice(1)
}

export const handleImage = async (event, setFieldValue) => {
    const file = event.target.files[0]

    if (file.size > 300000) {
        return event.target.setCustomValidity("File must be within 3kb")
    }

    event.target.setCustomValidity("")

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
        setFieldValue(event.target.name, reader.result)
    }
}

export const fileToString = async (file) => {
    if (!file) return ""

    const reader = new FileReader()

    reader.readAsDataURL(file)

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result)
        }
    })
}

export function fullName(user) {
    return `${user?.firstName} ${user?.lastName}`
}

















