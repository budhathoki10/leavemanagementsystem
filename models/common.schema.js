const requiredString = {
  type: String,
  required: true,
};

const uniqueRequiredString = {
  ...requiredString,
  unique: true,
};
const normalType = {
  type: String,
};

module.exports = {
  requiredString,
  normalType,
  uniqueRequiredString,
};
