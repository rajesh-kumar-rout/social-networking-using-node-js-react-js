import React from "react"
import App from "./App"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "./index.css"
import "./styles/variables.css"
import "./styles/index.css"
import "./styles/reset.css"
import "react-toastify/dist/ReactToastify.css"

const root = createRoot(document.getElementById("root"))

root.render(
    <>
        <ToastContainer
            position="top-center"
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
