const {Translate} = require('@google-cloud/translate').v2;
const deepl = require("deepl-node");
const translator = new deepl.Translator(
  "beb3055e-402a-3bb9-68fa-13815e7876ff:fx"
);
const express = require("express");
const router = express();
var serviceAccount = require("../serviceAccountKey.json");
var cors = require('cors');

const translate = new Translate({
  credentials: serviceAccount,
  projectId: serviceAccount.project_id,
});



router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/d", (req, res) => {
  (async () => {
    const target_lang = req.body.target_lang;
    const source_lang = req.body.source_lang;
    const text = req.body.text;
 
    const result = await translator.translateText(
      text,
      source_lang,
      target_lang
    );

    const payload = {
      translation: result.text,
    };
    res.status(200).json(JSON.stringify(payload));
  })();
});

router.get("/d/languages", (req, res) => {
  (async () => {
    const sourceLanguages = await translator.getSourceLanguages();

    const targetLanguages = await translator.getTargetLanguages();
    const payload = {
      target_langs: targetLanguages,
      source_langs: sourceLanguages,
    };
    res.status(200).json(JSON.stringify(payload));
  })();
});

router.post("/g", (req, res) => {
  const target_lang = req.body.target;
  const source_lang = req.body.source_lang;
  const source = req.body.source;
  
  (async () => {
 
    let [translations] = await translate.translate(source, target_lang);
    // translations = Array.isArray(translations) ? translations : [translations];
    console.log(translations);
    const payload = {
      translation: translations,
    };
    res.status(200).json(JSON.stringify(payload));
    })();

});

router.get("/g/languages", (req, res) => {
  (async  () => {
    // Lists available translation language with their names in English (the default).
    const [languages] = await translate.getLanguages();
  

    const payload = {
      target_langs: languages,
      source_langs: languages,
    };
    res.status(200).json(JSON.stringify(payload));
  })();
});


module.exports = router;