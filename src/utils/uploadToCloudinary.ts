import cloudinary from "./cloudinary";
import fs from "fs";

const uploadToCloudinary = (filePath: string, folder = "projects") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: folder,
      },
      (error, result) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file", err);
            reject(err);
          }
          if (error) {
            reject(error);
          }
          resolve(result);
        });
      }
    );
  });
};

export default uploadToCloudinary;
