import React from "react"
import App from "./App"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "./index.scss"
import "react-toastify/dist/ReactToastify.css"

const root = createRoot(document.getElementById("root"))

root.render(
    <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </>
)
