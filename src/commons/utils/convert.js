const formatPhone = (phone) => {
  const formattedPhone = phone.startsWith("0")
    ? `+84${phone.substring(1)}`
    : `+${phone}`;
  return formattedPhone;
};

const splitUsername = (email) => {
  const username = email.substring(0, email.indexOf("@"));
  return username;
};

module.exports = { formatPhone, splitUsername };
