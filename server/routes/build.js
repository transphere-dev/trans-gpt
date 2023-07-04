
const express = require('express');
const router = express.Router();
var cmd = require("node-cmd")


router.get('/build', async (req, res) => {

  try {
    cmd.run('git pull')
    cmd.run('cmd ../.. && npm run build && pm2 reload ecosystem.config.js');



    res.send('Building app in proccess!');
  } catch (error) {
    res.status(400).send('Invalid or expired email verification token');
  }
});

module.exports = router;