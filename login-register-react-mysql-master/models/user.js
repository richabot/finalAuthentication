const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      authenticated: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0
      },
      twofactorSecret: {
        type: DataTypes.STRING,
        allowNull: true
      },
      twofactorTempSecret: {
        type: DataTypes.STRING,
        allowNull: true
      },
      twofactorDataURL: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      twofactorOTPURL: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      emailToken: {
        type: DataTypes.STRING(128),
        defaultValue: 0
      },
      isVerified: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0
      }
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.generateAuthToken = function() {
    const token = jwt.sign(
      { id: this.id, username: this.username },
      process.env.jwtPrivateKey
    );
    return token;
  };

  return User;
};
