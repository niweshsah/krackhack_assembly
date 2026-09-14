const { createServer } = require("http");
const { app } = require("./app");

const port = Number(process.env.PORT || 5000);
const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});