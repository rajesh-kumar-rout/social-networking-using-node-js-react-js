import axios from "axios"
import { BASE_URL } from "./constants"
import Cookie from "js-cookie"
axios.defaults.baseURL = BASE_URL

axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
    if (Cookie.get("x-csrf-token")) {
        config.headers["csrf-token"] = Cookie.get("x-csrf-token")
    }
    return config
})

axios.interceptors.response.use(response => response, error => {
    if (error.response.status === 401) {

        window.location.reload()
    }

    return Promise.reject(error)
})

export default axios