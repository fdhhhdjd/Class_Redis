//* IMPORT
const app = require("./src/app");
const {
  app: { port: PORT },
} = require("./src/commons/configs/app.config");

app.listen(PORT, () => {
  console.info(`💸 Api backend start with http://localhost:${PORT} 🔥 !`);
  console.log(`Worker pid ${process.pid}`);
});
