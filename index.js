// index.js
import './env.variabls.js';
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import jwtAuth from "./src/middlewares/JwtAuth.middleware.js";
import serverError from "./src/errorHandler/errorHandler.js";
import connectionUsingMongoose from "./src/config/Mongodb.config.js";
import UserRouter from "./src/routes/user.routes.js";
import IplRouter from "./src/routes/ipl.routes.js";
import {Server} from "socket.io";
import { IplModel } from "./src/schemas/IplTeams.js";
import { UserModel } from "./src/schemas/Users.js";
import http from'http';

const app = express();
const server = http.createServer(app);
//Create io using Socket io.
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

// parse the JSON data received from req.body
app.use(express.json());

// Add the cookie parser for storing multiple cookies and parse them into key value pairs
app.use(cookieParser());

//Make the pages available for rendering
app.use(express.static(path.resolve(path.join("src", "views"))));

//Make the images available for rendering
app.use(express.static(path.resolve(path.join("src", "images"))));

// User Routes
app.use("/user", UserRouter);

// Show the homepage to the authenticated user
app.get("/homepage", jwtAuth, (req, res, next) => {
  res.sendFile(path.resolve(path.join("src", "views", "homepage.html")));
});

// IPL routes
app.use("/ipl", jwtAuth, IplRouter);

// Show the user signup/signin page
app.get("/", (req, res, next) => {
    res.sendFile(path.resolve(path.join("src", "views", "UserSignupSignin.html")));
  });

// Handle IPL updates and emit to connected clients using Socket.IO
io.on("connection", (socket) => {

  // Logic to handle IPL updates
  IplModel.watch().on("change", async (data) => {

    // Fetch updated IPL data
    const updatedIplData = await IplModel.find();

    // Emit updated data to connected clients
    io.emit("update", { message: "IPL data updated", updatedData: data }); 
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Serverlication level error handler
app.use((err, req, res, next) => {
  // Developer defined errors using the throw keyword
  if (err instanceof serverError) {
    res.status(err.code).send(err.message);
  }
  // All other serverlication level errors, not handled by explicitly
  else {
    console.log(err);
    res.status(500).send("Something went wrong at server end, please try again later!");
  }
});

app.use((req, res, next) => {
  res.send("Hello from server");
});

// Start server
server.listen(3002, () => {
  console.log("Server is listening on 3002");
  connectionUsingMongoose();
});
