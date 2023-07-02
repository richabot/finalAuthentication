const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const db = require("../models/index");
const path = require("path");
const router = express.Router(); //api/users
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');
const { verifiedemail } = require("../middleware/verified");
const verified = require("../middleware/verified");
function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}

// let user = {
//   'firstName': "Demo",
//   'lastName': "1",
//   email: "richagshah11@gmail.com",
//   password: "test"
// }



router.post("/", verified ,async (req, res) => {
 console.log(req.body,"req.body in /")
  const user1 = await db.User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (!user1) return res.status(400).send("Invalid email or password");
  
  if (user1.authenticated !== 1) {
   
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

  

    const validPassword = await bcrypt.compare(req.body.password, user1.password);
    if (!validPassword) return res.status(400).send("Invalid email or password");

    const token = user1.generateAuthToken();

    res.send(token);
  } else {
   
    const user1 = await db.User.findOne({
      where: {
        email: req.body.email
      }
    });
   


    const validPassword = await bcrypt.compare(req.body.password, user1.password);
    if (!validPassword) return res.status(400).send("Invalid email or password");
    const token = user1.generateAuthToken();

    // res.send(token);
    if (!req.headers['x-otp']) {
      return res.status(206).send(token);
    }
    //validate otp
    var verified = speakeasy.totp.verify({
      secret: user1.twofactorSecret,
      encoding: 'base32',
      token: req.headers['x-otp']
    });
    if (verified) {
      return res.send('success');
    } else {
      return res.status(400).send('Invalid OTP');
    }

  }


});


router.get('/twofactor/authenticated',async (req, res) => {
  console.log(req.body,"req.body in /twofactor/authenticated")
  const { email } = req.query;
  const userFromDb = await db.User.findOne({ where: { email: email} });
  const authenticated = userFromDb ? userFromDb.authenticated : null;
  // Fetch authenticated value from the database

  // Send the authenticated value as a JSON response
  res.json({ authenticated });
});

router.post('/twofactor/setup', async function (req, res) {
  console.log(req.body,"req.body in /twofactor/setup") //empty
 
  const userFromDb = await db.User.findOne({ where: { email: req.body.email } });

  const authenticated = userFromDb ? userFromDb.authenticated : null;

  const secret = speakeasy.generateSecret({ length: 10 });
 
  var url = speakeasy.otpauthURL({
    secret: secret.ascii,
    label: "doyenhub",
    issuer: "richa"
  });
  QRCode.toDataURL(url, async (err, data_url) => {
    //save to logged in user.
    // user.twofactor = {
    //   secret: "",
    //   tempSecret: secret.base32,
    //   dataURL: data_url,
    //   otpURL: secret.otpauth_url
    // };
    await userFromDb.update({
      twofactorSecret: "",
      twofactorTempSecret: secret.base32,
      twofactorDataURL: "true",
      twofactorOTPURL: secret.otpauth_url
    });


    //
    return res.json({
      message: 'Verify OTP',
      tempSecret: secret.base32,
      dataURL: data_url,
      otpURL: secret.otpauth_url,
      authenticated:authenticated,
    });
  });
});

//get 2fa details
router.get('/twofactor/setup',async function (req, res) {

  // res.json(user.twofactor);
  const { email } = req.query;
  const userFromDb = await db.User.findOne({ where: { email: emai } });

  // Extract the two-factor authentication data from the user's database record
  const twofactorData = {
    secret: userFromDb.twofactorSecret,
    tempSecret: userFromDb.twofactorTempSecret,
    dataURL: userFromDb.twofactorDataURL,
    otpURL: userFromDb.twofactorOTPURL
  };

  res.json(twofactorData);
});

//disable 2fa
router.delete('/twofactor/setup', async function (req, res) {
  // console.log(req.body,"req.body in delete twofactor/setup")
  // delete user.twofactor;
  // req.body
  // await db.User.update({
  //   twofactorSecret: null,
  //   twofactorTempSecret: null,
  //   twofactorDataURL: null,
  //   twofactorOTPURL: null,
  //   authenticated: false
  // });
  // await db.User.update(
  //   { authenticated: 0 },
  //   { where: { email: user.email } }
  // );

  // res.send('success');
  try {
    await db.User.update({
      twofactorSecret: null,
      twofactorTempSecret: null,
      twofactorDataURL: null,
      twofactorOTPURL: null,
      authenticated: 0
    }, {
      where: { email: req.body.email }
    });

    res.send('Two-factor authentication disabled successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

//before enabling totp based 2fa; it's important to verify, so that we don't end up locking the user.
router.post('/twofactor/verify', async function (req, res) {
  console.log(req.body,"req.body in  twofactor/verify")//use exit as email and password
  const exist = await db.User.findOne({
    where: { email: req.body.email }
  });
 
  var verified = speakeasy.totp.verify({
    secret: exist.twofactorTempSecret, //secret of the logged in user
    encoding: 'base32',
    token: req.body.token
  });
  if (verified) {
    // user.twofactor.secret = user.twofactor.tempSecret;
    await exist.update({
      twofactorSecret: exist.twofactorTempSecret,
      authenticated: 1
    });
   
    // await db.User.update(
    //   { authenticated: 1 },
    //   { where: { email: user.email } }
    // );


    return res.send('Two-factor auth enabled');
  }
  return res.status(400).send('Invalid token, verification failed');
});

router.use(express.static(path.join(__dirname, 'build')));

//EXPL: Front-end app
router.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
module.exports = router;
