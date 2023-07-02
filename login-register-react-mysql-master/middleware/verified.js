const db = require("../models/index");

module.exports = async function(req, res, next) {
    try {
      const user = await db.User.findOne({
        where: {
          email: req.body.email,
        },
      });
  
      if (!user) {
        return res.status(400).send('User not found');
      }
  
      if (user.isVerified) {
        // User is verified, proceed to the next middleware or route handler
        next();
      } else {
        return res.status(400).send('Please verify your email before logging in');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  };
  