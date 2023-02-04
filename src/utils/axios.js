import axios from "axios"
import { BASE_URL } from "./constants"

axios.defaults.baseURL = BASE_URL

axios.interceptors.request.use(config => {
    if (localStorage.getItem("authToken")) {
        config.headers.authorization = `Bearer ${localStorage.getItem("authToken")}`
    }
    return config
})

axios.interceptors.response.use(response => response, error => {
    if (error.response.status === 401) {
        localStorage.removeItem("authToken")
        window.location.reload()
    }

    return Promise.reject(error)
})

export default axios