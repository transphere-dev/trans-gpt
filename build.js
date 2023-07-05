
try {
    const resp = fetch('http://192.168.4.62:8080/api/app/build')
    resp.then(data => data.json())
    .then(data => console.log(data))
    .catch(e => console.log(e.message))
  
    
} catch (error) {
    console.log("\x1b[31m App build encountered an error! \x1b[0m");
    console.log(`\x1b[31m ${error.message} \x1b[0m`);


}