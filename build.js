
var cmd = require("node-cmd");

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

  } catch (error) {
    console.log("\x1b[31m App build encountered an error! \x1b[0m");
  }

