const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();



function base64_encode(file) {
    return "data:image/jpg;base64," + fs.readFileSync(file, 'base64');
}

router.post('/',  (req, res) => {
    const { image_path } = req.body;
    console.log(req.body)

    // Create the directory to save the extracted images


    try {
        const crop_dir = path.join(`${image_path}`);
        base_64_img =  base64_encode(crop_dir)
        res.json({ data: base_64_img })

    } catch (error) {
        res.status(400).json({ message: 'Error loading image' })
    }


});

module.exports = router;
