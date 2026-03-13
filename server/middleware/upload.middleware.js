import multer from "multer";
import path from "path";
import fs from "fs";

/*
 Ensure upload folder exists
*/

const uploadPath = "uploads/products";

if (!fs.existsSync(uploadPath)) {
 fs.mkdirSync(uploadPath, { recursive: true });
}

/*
 Storage config
*/

const storage = multer.diskStorage({

 destination: function (req, file, cb) {
  cb(null, uploadPath);
 },

 filename: function (req, file, cb) {

  const ext = path.extname(file.originalname);

  cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);

 }

});

/*
 File filter
*/

const fileFilter = (req, file, cb) => {

 if (file.mimetype.startsWith("image")) {
  cb(null, true);
 } else {
  cb(new Error("Only image files allowed"), false);
 }

};

const upload = multer({
 storage,
 fileFilter
});

export default upload;