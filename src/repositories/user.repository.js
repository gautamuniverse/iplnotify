import mongoose from "mongoose";
import { UserModel } from "../schemas/Users.js";
import AppplicationError from "../errorHandler/errorHandler.js";

class UserRepository {
  //Function to handle the signup
  async signup(data) {
    try {
      const newUser = new UserModel(data);
      const savedUser = await newUser.save();
      return {
        success: true,
        message: "User  created successfully",
      };
    } catch (err) {
      console.log(err);
      throw new AppplicationError(
        "Something went wrong with the database",
        500
      );
    }
  }

  //Also used at places where we need the user data
  async signin(data) {  
    try {
      const findUser = await UserModel.findOne(data);
      if (findUser) return { success: true, msg: findUser };
      else return { success: false, msg: "User not found!" };
    } catch (err) {
      console.log(err);
      throw new AppplicationError(
        "Something went wrong with the database",
        500
      );
    }
  }

  //Update user functionality
  async updateUser(query, data) {
    try {
      const updateUser = await UserModel.updateOne(query, data);
      if (updateUser.modifiedCount > 0)
        return { success: true, msg: "User Details Updated Successfully!" };
      else {
        return {
          success: false,
          msg: "User not found or something went wrong with the server!",
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

}

export default UserRepository;
