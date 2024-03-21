import IPLRepository from "../repositories/ipl.repository.js";
import UserRepository from "../repositories/user.repository.js";

class IPLController {
  constructor() {
    this.iplRepository = new IPLRepository();
  }

  //function to add new data to the ipl repo
  async insertManyRecords(req, res, next) {
    try {
      const email = req.email;
      //Check if user logged in
      if (!email) {
        return res.status(401).send({
          success: false,
          message: "User not authenticated!",
        });
      } else {
        //Also check if the user has a role admin
        const findUser = await new UserRepository().signin({ email });
        if (findUser.success) {
          if (findUser.msg.role !== "admin") {
            {
              return res.status(401).send({
                success: false,
                message: "Unauthorized role!",
              });
            }
          } else {
            const { data } = req.body;

            if (!data)
              return res.status(500).send({
                success: false,
                msg: "Please validate data!",
              });

            const result = await this.iplRepository.insertManyRecords(data);
            if (result.success) {
              return res.status(200).send({
                success: true,
                msg: "Data added successfully!",
              });
            } else {
              return res.status(500).send({
                success: false,
                msg: "Something went wrong with the database!",
              });
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  //function to handle updates to the ipl repo
  async updateIPLRepo(req, res, next) {
    try {
      const email = req.email;
      //Check if user logged in
      if (!email) {
        return res.status(401).send({
          success: false,
          message: "User not authenticated!",
        });
      } else {
        const { query, data } = req.body;

        // Validate the query and data using a library like Joi

        if (!query || !data) {
          return res.status(400).send({
            success: false,
            message: "Please validate query and data",
          });
        }

        // Check if the user has a role admin
        const findUser = await new UserRepository().signin({ email });
        if (findUser.success) {
          if (findUser.msg.role !== "admin") {
            return res.status(401).send({
              success: false,
              message: "Unauthorized role!",
            });
          } else {
            //update the IPLRepo
            const result = await this.iplRepository.updateTeam({
              query,
              data,
            });

            if (result.success) {
              return res.status(200).send({
                success: true,
                msg: "Data updated successfully!",
              });
            } else {
              return res.status(500).send({
                success: false,
                msg: "Something went wrong with the database!",
              });
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getAllTeams(req, res, next) {
    try {
      const result = await this.iplRepository.getAllTeams();
      if (result.success) {
        return res.status(200).send({
          success: true,
          msg: result.message,
        });
      } else {
        return res.status(500).send({
          success: false,
          msg: "Something went wrong with the database!",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default IPLController;
