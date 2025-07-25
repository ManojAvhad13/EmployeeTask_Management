import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    if (!imageFile) {
        throw new Error("No image file provided for upload.");
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            // Do NOT set Content-Type; let axios handle it
            // headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Return the entire response.data or a specific field if your API returns something specific
        return response.data;
    } catch (error) {
        // More informative error message
        const errorMessage =
            error?.response?.data?.message ||
            error.message ||
            "Error uploading the image";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export default uploadImage;
