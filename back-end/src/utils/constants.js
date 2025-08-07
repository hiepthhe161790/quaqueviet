const serverHostPort = process.env.HOST_PORT || 3333;
const serverHostURL = process.env.HOST_URL;
const databaseURL = process.env.DB_URI;

exports.serverHostPort = serverHostPort;
exports.serverHostURL = serverHostURL;
exports.databaseURL = databaseURL;
