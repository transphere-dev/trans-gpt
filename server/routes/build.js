const express = require("express");
const router = express.Router();
var cmd = require("node-cmd");

router.get("/build", async (req, res) => {
  try {

    console.log("\x1b[32m--- Updating transgpt --- \x1b[0m");
    const gitPull = cmd.runSync("git pull");
    console.log(` 
    Git pull Err ${gitPull.err}
    
    Git pull Data ${gitPull.data}
`);

    console.log("\x1b[32m--- Updating packages --- \x1b[0m");
    const install = cmd.runSync("npm i && cd server && npm i");

    console.log(`
    install Err ${install.err}

    install Data ${install.data}
`);

    console.log("\x1b[32m--- Building transgpt --- \x1b[0m");

    const build = cmd.runSync("cd .. && npm run build");

    console.log(` 
   build Err ${build.err}
   
   build Data ${build.data}
`);

    console.log("\x1b[32m--- Reloading pm2 --- \x1b[0m");

    const pm2 = cmd.runSync("pm2 reload ecosystem.config.js && pm2 save");

    console.log(`   
pm2 Err ${pm2.err}

pm2 Data ${pm2.data}
`);

    res.status(200).json({message:"Building app in progress!"});
  } catch (error) {
    res.status(400).send("App build encountered an error!");
  }
});

module.exports = router;
