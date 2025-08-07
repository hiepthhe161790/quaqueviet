const serverHostPort = process.env.HOST_PORT || 3333;
const serverHostURL = process.env.HOST_URL || "127.0.0.1";
const databaseURL = process.env.DB_URI || "mongodb://127.0.0.1:27017/SDN";

exports.serverHostPort = serverHostPort;
exports.serverHostURL = serverHostURL;
exports.databaseURL = databaseURL;
