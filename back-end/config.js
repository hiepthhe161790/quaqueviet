require('dotenv').config();

module.exports = {
  accessTokenSecret: process.env.ACCESS_SECRET_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpiry: '5m', 
  refreshTokenExpiry: '7d', 
};
