const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
const AdmZip = require("adm-zip");
const path = require("path");
const unrar = require("node-unrar-js");

var cmd = require("node-cmd");
const upload = multer({ dest: "uploads/" });

function base64_encode(file) {
  return "data:image/jpg;base64," + fs.readFileSync(file, "base64");
}

router.post("/extract", upload.single("file"), (req, res) => {
  const { user_id, name } = req.body;
  const filePath = req.file.path;

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
      res.json({ message: "Comic uploaded successfully" });
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

router.post("/", (req, res) => {
  const { image_path } = req.body;
  console.log(req.body);

  // Create the directory to save the extracted images

  try {
    const crop_dir = path.join(`${image_path}`);
    base_64_img = base64_encode(crop_dir);
    res.json({ data: base_64_img });
  } catch (error) {
    res.status(400).json({ message: "Error loading image" });
  }
});

router.post("/ocr", (req, res) => {
  const { userId, comicName } = req.body;
  console.log(req.body);

  // Create the directory to save the extracted images

  try {
    console.log("\x1b[32m--- OCR started --- \x1b[0m");
    const extract = cmd.runSync(
      `python ./server/ocr/ocr.py --userId ${userId} --cname ${comicName} `
    );

    console.log(`
     Data ----> ${extract.data}

     Err ----> ${extract.err}
 `);
    const comic_texts = extract.data;
    console.log(comic_texts);
    res.json({ data: comic_texts });
  } catch (error) {
    res.status(400).json({ message: "Error loading image" });
  }
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  try {
    let comics = [];
    // Fertch the comics
    const directory = path.join(
      path.dirname(__dirname),
      "uploads/comics",
      `${userId}`
    );
    fs.readdir(directory, (err, files) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      res.json({ files });
    });
  } catch (err) {
    res.status(500).json({ message: "Comic not found" });
  }
});

module.exports = router;

module.exports = router;
