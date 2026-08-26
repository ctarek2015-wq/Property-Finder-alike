const multer = require("multer");

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fields: 30,
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, done) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      return done(new Error("Please choose a JPG, PNG, or WebP image."));
    }

    return done(null, true);
  },
});

const uploadImages = (req, res, next) => {
  upload.array("images", 10)(req, res, (error) => {
    if (error) {
      req.uploadError =
        error.code === "LIMIT_FILE_SIZE"
          ? "Each image must be 5 MB or smaller."
          : error.message;
    }

    return next();
  });
};

const uploadProfilePic = (req, res, next) => {
  upload.single("profileImage")(req, res, (error) => {
    if (error) {
      req.uploadError =
        error.code === "LIMIT_FILE_SIZE"
          ? "Profile image must be 5 MB or smaller."
          : error.message;
    }

    return next();
  });
};

module.exports = {
  upload,
  uploadImages,
  uploadProfilePic,
};
