import { v2 } from "cloudinary";
import { ApiError } from "../../utils/ApiError.js";
import { httpCodes } from "../constants.js";
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  try {
    const cloudinaryResponse = await v2.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return cloudinaryResponse;
  } catch (error) {
    throw new ApiError(httpCodes.badGateway, error.message);
  }
};

async (publicId) => {
  try {
      await v2.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (error) {
    throw new ApiError(httpCodes.badGateway, error.message);
  }
};

export { uploadMediaToCloudinary, deleteMediaFromCloudinary };