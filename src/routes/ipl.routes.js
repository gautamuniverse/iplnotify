import express from "express";
import IPLController from "../controller/IPLController.js";

const IplRouter = express.Router();

const iplController = new IPLController();

//Route to handle the addition of new data to the ipl repo, note we are sending the data in the form of array to the below function
IplRouter.post("/add", (req, res, next) =>
  iplController.insertManyRecords(req, res, next)
);

//Route to handle the updation of data to the ipl repo
IplRouter.put("/update", (req, res, next) =>
  iplController.updateIPLRepo(req, res, next)
);

//Route to get all the teams
IplRouter.get("/getall", (req, res, next) =>
  iplController.getAllTeams(req, res, next)
);

export default IplRouter;
