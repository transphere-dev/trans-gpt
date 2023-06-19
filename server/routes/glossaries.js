const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { pool, createGlossary, getGlossary, getTerms } = require('../db');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// , upload.single('file')
router.post('/upload', upload.single('file'), async (req, res) => {
  console.log(pool);
  try {
    const { user_id,language,name } = req.body;

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const terms = XLSX.utils.sheet_to_json(sheet);

    // const name = req.file.originalname.split('.')[0]
    const created_at = new Date();

    try {
      const gloss = await createGlossary(user_id, name,language,created_at,terms);

      
    } catch (error) {
      console.error('Error creating glossary:', error);

    }


    res.json({ success: true, message: 'Glossaries uploaded successfully' });
  } catch (error) {
    console.error('Error uploading glossaries:', error);
    res.status(500).json({ success: false, message: 'Error uploading glossaries' });
  }
});

// Define an API endpoint to fetch glossaries
router.get('/:userId', async (req, res) => {
  const user_id = parseInt(req.params.userId, 10);
  try {
    // Fetch glossaries from the database
    const gloss = await getGlossary(user_id);
   // Send the glossaries as the response
    res.json(gloss);
  } catch (error) {
    console.error('Error fetching glossaries:', error);
    res.status(500).json({ error: 'Failed to fetch glossaries' });
  }
});

router.get('/:userId/glossary/:glossarId', async (req, res) => {
  const user_id = parseInt(req.params.userId, 10);
  const glossary_id = parseInt(req.params.glossarId, 10);
  try {
    // Fetch glossaries from the database
    const terms = await getTerms(user_id,glossary_id);
   // Send the glossaries as the response
    res.json(terms);
  } catch (error) {
    console.error('Error fetching terms:', error);
    res.status(500).json({ error: 'Failed to fetch terms' });
  }
});
module.exports = router;
