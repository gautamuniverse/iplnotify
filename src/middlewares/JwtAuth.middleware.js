import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
      //Get the token from the user's cookie
      const token = req.cookies.jwt;

      //If no token found then send unauthorized code along with redirection to the homepage
      if (!token) return res.status(401).redirect("/");

      else {
        //Verify the token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        req.email = payload.email;
        next(); //call the next middleware in the pipeline
      }
  } catch (err) {
    console.log(err);
    if (err instanceof jwt.TokenExpiredError) {
      // Token is expired
      console.error("Token is expired");
    } else {
      return res.status(401).send("Invalid Token");
    }
  }
};

export default jwtAuth;