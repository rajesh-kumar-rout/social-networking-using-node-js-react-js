import { object, string, ref } from "yup"

export const changePasswordSchema = object().shape({
    oldPassword: string()
        .min(6, "Invalid old password")
        .max(20, "Invalid old password")
        .required("Old password is required"),

    newPassword: string()
        .min(6, "New password must be at least 6 characters")
        .max(20, "New password must be within 20 characters")
        .required("New password is required"),

    confirmNewPassword: string()
        .required("Please confirm your new password")
        .oneOf([ref("newPassword")], "New password does not match"),
})

export const addPostSchema = object().shape({
    description: string()
        .trim()
        .max(255, "Description must be within 255 characters")
        .when(["image", "videoUrl"], {
            is: (image, videoUrl) => image === "" && videoUrl === "",
            then: string().required("Either image or video url or description required")
        })
})

export const editAccountSchema = object().shape({
    name: string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must be within 30 characters")
        .required("Name is required"),

    email: string()
        .email("Invalid email")
        .trim()
        .max(30, "Email must be within 30 characters")
        .required("Email is required")
})

export const loginSchema = object().shape({
    email: string().required("Email is required"),

    password: string().required("Password is required")
})

export const registerSchema = object().shape({
    firstName: string()
        .trim()
        .max(20, "First name must be within 20 characters")
        .required("First name is required"),

    lastName: string()
        .trim()
        .max(20, "Last name must be within 20 characters"),

    bio: string()
        .trim()
        .max(255, "Bio must be within 255 characters")
        .required("Bio is required"),

    email: string()
        .email("Invalid email")
        .trim()
        .max(30, "Email must be within 30 characters")
        .required("Email is required"),

    work: string()
        .trim()
        .max(30, "Work must be within 30 characters"),

    school: string()
        .trim()
        .max(30, "School must be within 30 characters"),

    college: string()
        .trim()
        .max(30, "College must be within 30 characters"),

    gender: string().required("Please select your gender"),

    currentCity: string()
        .trim()
        .max(30, "Current city must be within 30 characters"),

    homeTown: string()
        .trim()
        .max(30, "Homw town must be within 30 characters"),

    password: string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be within 20 characters")
        .required("Password is required"),

    confirmPassword: string()
        .required("Please confirm your password")
        .oneOf([ref("password")], "Password does not match"),
})
export const editProfileSchema = object().shape({
    firstName: string()
        .trim()
        .max(20, "First name must be within 20 characters")
        .required("First name is required"),

    lastName: string()
        .trim()
        .max(20, "Last name must be within 20 characters"),

    bio: string()
        .trim()
        .max(255, "Bio must be within 255 characters")
        .required("Bio is required"),

    email: string()
        .email("Invalid email")
        .trim()
        .max(30, "Email must be within 30 characters")
        .required("Email is required"),

    work: string()
        .trim()
        .max(30, "Work must be within 30 characters"),

    school: string()
        .trim()
        .max(30, "School must be within 30 characters"),

    college: string()
        .trim()
        .max(30, "College must be within 30 characters"),

    gender: string().required("Please select your gender"),

    currentCity: string()
        .trim()
        .max(30, "Current city must be within 30 characters"),

    homeTown: string()
        .trim()
        .max(30, "Homw town must be within 30 characters")
})