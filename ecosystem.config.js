module.exports = {
    apps: [
        {
            name: "frontend",
            script: "start.js",
            args : "run start",
            watch: "false",
            restart_delay: 3000,
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            }
        },
            {
                name: "server",
                script: "server/app.js",
                args : "run start",
                watch: "false",
                restart_delay: 3000,
                env: {
                    NODE_ENV: "production",
                    PORT: 8080,
                }
            }
        
    ]
}     
