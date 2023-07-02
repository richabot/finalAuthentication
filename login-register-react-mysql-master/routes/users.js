const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const db = require("../models/index");
const nodemailer = require("nodemailer");
const crypto = require('crypto');


const router = express.Router(); //api/users

// Init email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD
  }
});

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: new PasswordComplexity().required()
  };

  return Joi.validate(user, schema);
}

// User Registration
// router.post("/", async (req, res) => {
//   try {
//     await validateUser(req.body);
//   } catch (err) {
//     return res.status(400).send(err.details[0].message);
//   }

//   const userFound = await db.User.findOne({
//     where: {
//       email: req.body.email
//     }
//   });
//   if (userFound) return res.status(400).send("User already registered");

//   // Create new user
//   let user = await db.User.build({
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//     emailToken:crypto.randomBytes(64).toString('hex'),
//     isVerified:0

//   });
//   // Hash password
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);

//   user = await user.save();
 
//   const token = user.generateAuthToken();

//   res.header("x-auth-token", token).send(_.pick(user, ["username", "email"]));
//   const verificationUrl = `localhost:${process.env.PORT ||
//     5000}/users/verifyemail?token=${user.emailToken}`;
//   const emailTemplate = {
//     subject: "Verify Your Email",
//     html: `
//       <p>Hello ${user.username},</p>
//       <p>Thank you for registering on our website. Please verify your email address by clicking the link below:</p>
//       <a href="${verificationUrl}">${verificationUrl}</a>
//       <p>If you did not sign up for our website, please ignore this email.</p>
//       <p>Thank you,</p>
//       <p>Doyenhub Team</p>
//     `,
//     from: process.env.EMAIL_LOGIN, // Replace with your email address or use a dynamic variable
//     to: user.email
//   };
   
//   const sendEmail = async () => {
//     try {
//       const info = await transporter.sendMail(emailTemplate);
//       console.log("Email sent", info.response);
//       // return res.status(200).send("Email sent");
//     } catch (err) {
//       console.log(err);
//       // return res.status(500).send("Error sending email");
//     }
//   };
//   sendEmail();


 
 
// });
router.post("/", async (req, res) => {
  try {
    await validateUser(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }

  const userFound = await db.User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (userFound) return res.status(400).send("User already registered");

  // Create new user
  let user = await db.User.build({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    emailToken:crypto.randomBytes(64).toString('hex'),
    isVerified:0
  });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(_.pick(user, ["username", "email"]));

  const verificationUrl = `localhost:${process.env.PORT || 5000}/api/users/verifyemail?token=${user.emailToken}`;
  const emailTemplate = {
    subject: "Verify Your Email",
    html: `
      <p>Hello ${user.username},</p>
      <p>Thank you for registering on our website. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>If you did not sign up for our website, please ignore this email.</p>
      <p>Thank you,</p>
      <p>Doyenhub Team</p>
    `,
    from: process.env.EMAIL_LOGIN,
    to: user.email
  };

  const sendEmail = async () => {
    try {
      const info = await transporter.sendMail(emailTemplate);
      console.log("Email sent", info.response);
    } catch (err) {
      console.log(err);
    }
  };

  sendEmail();
});

router.get("/verifyemail", async (req, res) => {
  const { token } = req.query;
  console.log("token to verify",token)
  // res.redirect("http://localhost:3000/")

  try {
    // Find the user with the matching token in the database
    const user = await db.User.findOne({
      where: {
        emailToken: token
      }
    });

    if (!user) {
      return res.status(400).send('Invalid token');
    }

    if (user.isVerified) {
      return res.send('Email already verified');
    }

    // Update the user's emailToken and isVerified status
    user.emailToken = '';
    user.isVerified = true;
    await user.save();

    // res.send('Email verified successfully');
    res.redirect("http://localhost:3000/login")
  } catch (error) {
    console.error(error);
    // res.status(500).send('Internal Server Error');
    res.redirect("http://localhost:3000/")
  }
});

// post to generate reset password url
router.post("/reset_password/:email", async (req, res) => {
  let user;
  try {
    user = await db.User.findOne({
      where: { email: req.params.email }
    });
  } catch (err) {
    return res.status(404).send("Error reading from database");
  }
  if (!user) {
    return res.status(404).send("Email never registered.");
  }
  // Generate one-time use URL with jwt token
  const secret = `${user.password}-${user.createdAt}`;
  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: 3600 // expires in 1 hour
  });
  const url = `localhost:${process.env.PORT ||
    3000}/users/reset_password_received/${user.id}/${token}`;

  const emailTemplate = {
    subject: "Password Reset Node Auth Application",
    html: `
      <p>Hello ${user.username},</p>
      <p>You recently requested to reset your password.</p>
      <p>Click the following link to finish resetting your password.</p>
      <a href=${url}>${url}</a>`,
    from: process.env.EMAIL_LOGIN,
    to: user.email
  };

  const sendEmail = async () => {
    try {
      const info = await transporter.sendMail(emailTemplate);
      console.log("Email sent", info.response);
      return res.status(200).send("Email sent");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error sending email");
    }
  };

  sendEmail();
});
// post to verify reset password url
router.post("/receive_new_password/:id/:token", async (req, res) => {
  // First parse request object
  // Get id and token within params, and new password in body
  const { id, token } = req.params;
  const { password } = req.body;
  // Validate new password
  try {
    await Joi.validate(
      { password },
      {
        password: new PasswordComplexity().required()
      }
    );
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }
  // get user from database with id
  let user;
  try {
    user = await db.User.findOne({
      where: { id }
    });
  } catch (err) {
    return res.status(404).send("Error reading database");
  }
  if (!user) return res.status(404).send("No user with that id");
  // Generate secret token
  const secret = `${user.password}-${user.createdAt}`;
  // Verify that token is valid
  const payload = jwt.decode(token, secret);
  if (!payload) {
    return res.status(404).send("Invalid id or token");
  }
  if (payload.id != id) {
    return res.status(404).send("Invalid id or token");
  }
  // Hash new password and store in database
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user = await user.save();
  return res.status(200).send("Password Reset Success!");
});

module.exports = router;
