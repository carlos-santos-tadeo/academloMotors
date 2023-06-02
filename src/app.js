const express = require("express");

//routes
const usersRouter = require("./routes/users.routes");
// const repairsRouter = require("./routes/repairs.routes");


const app = express();
//este middleware de aca me sirve para que mi servidor
//entienda formatos json que le estan llegando
app.use(express.json());

app.use((req, res, next) => {
  const time = new Date().toISOString();

  req.requestTime = time;
  next();
});

app.use("/api/v1/users", usersRouter);
// app.use("/api/v1/repairs", repairsRouter)



module.exports = app;