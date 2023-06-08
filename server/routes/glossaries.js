const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { pool } = require('../db');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { user_id,language } = req.body;

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const glossaries = XLSX.utils.sheet_to_json(sheet);
    console.log(req.file.originalname);
    const name = req.file.originalname.split('.')[0]
    const created_at = new Date();

    const {rows} = await pool.query('INSERT INTO glossaries(user_id) VALUES ($1,$2,$3,$4,NOW() )', [user_id, name,language,created_at]);
    console.log(rows[0]);
    // Save the glossaries to the database
    // for (const glossary of glossaries) {
    //   const { Term, Source,Target,Remarks } = glossary;
    //   await pool.query('INSERT INTO glossaries (term) VALUES ($1, )', [Term, Source,Target,Remarks]);
    // }

    res.json({ success: true, message: 'Glossaries uploaded successfully' });
  } catch (error) {
    console.error('Error uploading glossaries:', error);
    res.status(500).json({ success: false, message: 'Error uploading glossaries' });
  }
});

module.exports = router;
