import moment from "moment"

export const postImgUrl = (url) => {
    if (url && url.startsWith("https://res.cloudinary.com/")) {
        return [
            url.split("upload/")[0],
            "upload/",
            "w_510,h_360,c_fill/",
            url.split("upload/")[1]
        ].join("")
    }
    return url;
}

export const dateToAgo = (date) => {
    const format = moment(date).fromNow()
    return format.charAt(0).toUpperCase() + format.slice(1)
}

export const getBase64 = async (image) => {
    const reader = new FileReader()
    
    reader.readAsDataURL(image)

    return new Promise((resolve) => {
        reader.onload = () => {
            resolve(reader.result)
        }
    })
}

















