const cloudinary = require('../services/cloudinary');
const streamifier = require('streamifier');

const uploadImageToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'Leave management' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const destroyExistingPhoto = async (applyforleave) => {
  await cloudinary.uploader.destroy(applyforleave.image_data.public_id);
};

module.exports = { uploadImageToCloudinary, destroyExistingPhoto };
