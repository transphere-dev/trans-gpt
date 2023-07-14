const express = require('express');
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const unrar = require('node-unrar-js');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
  const { user_id, name } = req.body;
  const filePath = req.file.path;

  // Create the directory to save the extracted images
  const directory = path.join('uploads/comics', `${user_id}/${name}`);
  fs.mkdirSync(directory, { recursive: true });

  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  if (fileExtension === '.rar') {

    res.status(400).json({ message: 'Unsupported file type' });

  } else if (fileExtension === '.zip') {
    const zip = new AdmZip(filePath);

    try {
      zip.extractAllTo(directory, true);
      console.log('Extraction complete');
      res.status(200).json({ message: 'Extraction complete' });
    } catch (err) {
      console.message('Extraction failed:', err);
      res.status(500).json({ message: 'Extraction failed' });
    }
  } else {
    // Unsupported file type
    fs.unlinkSync(filePath);
    res.status(400).json({ message: 'Unsupported file type' });
  }
});

module.exports = router;
