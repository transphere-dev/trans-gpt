const express = require("express");
const multer = require("multer");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const unrar = require("node-unrar-js");
var cmd = require("node-cmd");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), (req, res) => {
  const { user_id, name } = req.body;
  const filePath = req.file.path;
  const fileName = req.file.originalname.split(".")[0];

  // Create the directory to save the extracted images

  const directory = path.join(
    path.dirname(__dirname),
    "uploads/comics",
    `${user_id}/${name}`
  );
  const crop_dir = path.join(
    path.dirname(__dirname),
    "uploads/comics",
    `${user_id}/${name}/dialog`
  );
  fs.mkdirSync(directory, { recursive: true });
  fs.mkdirSync(crop_dir, { recursive: true });

  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  if (fileExtension === ".rar") {
    res.status(400).json({ message: "Unsupported file type" });
  } else if (fileExtension === ".zip") {
    const zip = new AdmZip(filePath);

    try {
      zip.extractAllTo(directory, true);
      console.log("Extraction complete");
      console.log("\x1b[32m--- OCR started --- \x1b[0m");

      // Read directory files
      //  Call python OCR script

      const extract = cmd.runSync(
        `python ./server/ocr/ocr.py --userId ${user_id} --cname ${name} --fname ${fileName}`
      );

      console.log(`
      Data ----> ${extract.data}

      Err ----> ${extract.err}
  `);
      const comic_texts = extract.data;
      console.log(comic_texts);
      res.json({ data: comic_texts });
    } catch (err) {
      console.message("Extraction failed:", err);
      res.status(500).json({ message: "Extraction failed" });
    }
  } else {
    // Unsupported file type
    fs.unlinkSync(filePath);
    res.status(400).json({ message: "Unsupported file type" });
  }
});

module.exports = router;
