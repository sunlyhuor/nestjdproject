import * as path from "path"
import * as multer from "multer"
import { unlinkSync } from "fs";
// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join("src" , "pictures" , "videos/" ) );
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Define filter for uploaded files


export function validateFile(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: 'File is required' });
  }else{

      // Validate file type
      const allowedTypes = ['video/mp4', 'video/mov'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        unlinkSync( path.join("src" , "pictures" , "videos/"+req.file.filename ) )
        return res.status(400).json({ message: 'Only mp4 and MOV video are allowed' });
      }else{

        const maxSize = (1024 * (1024 * 1000 )) ; // 1 MB
          if (req.file.size > maxSize) {
            unlinkSync( path.join("src" , "pictures" , "videos/"+req.file.filename ) )
            return res.status(400).json({ message: 'File size too large. Maximum size allowed is 1GM' });
          }

          next();
        }

  }
}

// Initialize multer middleware with defined storage and file filter
export const upload = multer({ 
  storage: storage,
  // fileFilter: fileFilter
});
