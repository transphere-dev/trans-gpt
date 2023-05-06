const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { pool } = require('../db');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const glossaries = XLSX.utils.sheet_to_json(sheet);

    // Save the glossaries to the database
    for (const glossary of glossaries) {
      const { term, source,target,remarks, definition } = glossary;
      await pool.query('INSERT INTO glossaries (term, definition) VALUES ($1, $2)', [term, definition]);
    }

    res.json({ success: true, message: 'Glossaries uploaded successfully' });
  } catch (error) {
    console.error('Error uploading glossaries:', error);
    res.status(500).json({ success: false, message: 'Error uploading glossaries' });
  }
});

module.exports = router;
