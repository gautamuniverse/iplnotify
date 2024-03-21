import UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import IPLRepository from "../repositories/ipl.repository.js";

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  //function to handle the signup page
  handleSignup = async (req, res, next) => {
    try {
      //Verify the name, email and passwords
      const { name, email, password, subscriptions, role } = req.body;
      if (!name || !email || !password) {
        return res.status(401).send({
          success: false,
          message: "Please validate the input fields",
        });
      }

      //Check if usre already registerd
      const findUser = await this.userRepository.signin({ email });
      if (findUser.success)
        return res
          .status(404)
          .send({ success: false, msg: "You are already registered!" });

      //Hash the user password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = {
        name,
        email,
        password: hashedPassword,
        subscriptions: subscriptions ? subscriptions : [],
        role: role ? role : "user",
      };

      const result = await this.userRepository.signup(newUser);

      if (result.success)
        return res
          .status(201)
          .send({ success: true, msg: "Registration successfull!" });
      else {
        return res.status(404).send({
          success: false,
          msg: "Something went wrong with the database",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //Function to handle the login page
  handleLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      //Validations
      if (!email || !password) {
        return res.status(401).send({
          success: false,
          message: "Please validate the input fields",
        });
      }

      //Find the user from the DB
      const findUser = await this.userRepository.signin({ email });
      if (!findUser.success) {
        return res.status(401).send({
          success: false,
          message: "User not registered!",
        });
      } else {
        const passFromDB = findUser.msg.password;
        //Compare the passwords
        const comparePass = await bcrypt.compare(password, passFromDB);
        //If passwords match
        if (comparePass) {
          //Check if already signed in
          if (req.cookies.jwt) {
            const now = new Date().getTime() / 1000;
            const payload = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
            const expires = payload.exp;
            // Compare expiration date to current timestamp
            if (expires && expires > now) {
              // Cookie not expired
              return res
                .status(200)
                .send({ success: true, msg: "You are already logged in." });
            }
          }

          //create token
          const token = jwt.sign(
            {
              userId: findUser.msg._id,
              email: email,
            },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 } // Token expires in 1 hour
          );

          //attach token to the user's response so that the user will send the token with subsequent requests
          const options = {
            maxAge: 60 * 60 * 1000, //cookie will expire in 1 hour
          };

          res.cookie("jwt", token, options); //Cookie name is jwt

          //Also store the token in the user's document in DB
          await this.userRepository.updateUser(
            { email },
            {
              $push: {
                tokens: token,
              },
            }
          );

          return res.status(200).send({
            success: true,
            msg: "You have successfully logged in!",
          });
        } else {
          return res.status(401).send({
            success: false,
            msg: "Invalid password, please try again!",
          });
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  async getTeams(req, res, next) {
    try {
      //get the user email
      const email = req.email;
      //Get the user details using the email
      const result = await this.userRepository.signin({ email });
    let teams = [];
      if (result.success) {
        // return res.status(200).send({
        //   success: true,
        //   msg: result.msg.subscriptions,
        // });

        //Now since we have the list of subscribed teams now we will find the teams and get there detailed data from the ipl database
        const getAllTeams = await new IPLRepository().getAllTeams();
        if(getAllTeams.success)
        {   
            getAllTeams.message.forEach((team) => {
                if(result.msg.subscriptions.includes(team.name))
                {
                    teams.push(team);
                }
            })

            return  res.status(200).send({
                success: true,
                msg: teams
            })
        }


      } else {
        return res.status(500).send({
          success: false,
          msg: "Something went wrong on the server side.",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  //   async updateUserDetails(){

  //   }
}

export default UserController;
