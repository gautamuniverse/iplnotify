import AppplicationError from "../errorHandler/errorHandler.js";
import { IplModel } from "../schemas/IplTeams.js";

class IPLRepository {
    async updateTeam(query, data){
        try {
            const updateTeam = await IplModel.updateOne(query, data);
            if (updateTeam.modifiedCount > 0)
              return { success: true, msg: "IPL Team(s) Updated Successfully!" };
            else {
              return {
                success: false,
                msg: "Query not found or something went wrong with the server!",
              };
            }
          } catch (err) {
            console.log(err);
            throw new AppplicationError(
              "Something went wrong with the database",
              500
            );
          }
    }

  //Function to add a new entry
async insertManyRecords(data) {
    try {
      const saveData = await IplModel.insertMany(data);
      return {
        success: true,
        message: "Data added successfully",
      };
    } catch (err) {
      console.log(err);
      throw new AppplicationError(
        "Something went wrong with the database",
        500
      );
    }
  }

    //Function to retrieve all the teams
    async getAllTeams (){
        try {
           const findTeams = await  IplModel.find({});

           if(findTeams){
            return {
              success: true,
              message: findTeams
            };
           }
           else {
            return {
                success: false,
                message: "No teams found"
            }
           }
            
          } catch (err) {
            console.log(err);
            throw new AppplicationError(
              "Something went wrong with the database",
              500
            );
          }
    }
}

export default IPLRepository;