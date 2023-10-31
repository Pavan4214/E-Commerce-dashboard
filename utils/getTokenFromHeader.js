const getTokenFromHeader = (req) => {
  //get token from header
  //console.log(req.headers);
  const token = req?.headers?.authorization?.split(" ")[1];
  if (token === undefined) {
    return "No token found in the header";
  } else {
    return token;
  }
};

module.exports = getTokenFromHeader;
