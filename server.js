const app = require("./app");

//setting up the port
const port = process.env.PORT || 2030;

//starting the server
app.listen(port, console.log(`Server started  on port ${port}`));
