import express from 'express';
import UserController from '../controller/UserController.js';
import jwtAuth from '../middlewares/JwtAuth.middleware.js';

const UserRouter = express.Router();

const userController = new UserController();

//Route to handle the signup
UserRouter.post('/signup', (req, res, next) => userController.handleSignup(req, res, next));

//Route to handle the signin
UserRouter.post('/signin', (req, res, next) => userController.handleLogin(req, res, next));

//Route to get the user details
UserRouter.get('/teams', jwtAuth, (req, res, next) => userController.getTeams(req, res, next)); 


//Route to handle the logout
UserRouter.get('/signout', (req, res, next) => {
        res.clearCookie("jwt");
        // Redirect to the home page after successful logout
        res.redirect('/');
})

export default UserRouter;