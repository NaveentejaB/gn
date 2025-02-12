require("dotenv").config();
const App = require("./src/app");


async function main() {
    const app = new App();
    try {
        await app.initialize();
        await app.start();
    } catch (error) {
      console.error('Failed to start the application:', error);
      process.exit(1);
    }
  }
  
  main();