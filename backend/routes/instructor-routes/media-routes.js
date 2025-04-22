import express from "express";
import multer from "multer";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { httpCodes } from "../../constants.js";
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from "../../helpers/cloudinary.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,result,"video uploaded successfully"));
  } catch (e) {
    console.log(e);

    throw new ApiError(httpCodes.serverSideError,"cannot upload to cloudinary")
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(httpCodes.badRequest, "Asset Id is required");
    }

    await deleteMediaFromCloudinary(id);

    res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,{},"Asset deleted "));
  } catch (e) {
    console.log(e);

    throw new ApiError(httpCodes.serverSideError,"Error deleting asset")
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok,results,"uploaded successfully"));
  } catch (event) {
    console.log(event);

    throw new ApiError(httpCodes.serverSideError, "Error in bulk uploading" + event.message);
  }
});

export { router };
