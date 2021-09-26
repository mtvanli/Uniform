require("dotenv").config();

if (process.env.UNIFORM_NESI_ENABLED == "true") {
  console.log("installing wranger...");
  var child_process = require("child_process");
  child_process.execSync("npm i @cloudflare/wrangler -g", { stdio: [0, 1, 2] });
} else {
  console.log(
    "skipping wrangler install since UNIFORM_NESI_ENABLED is not set"
  );
}
