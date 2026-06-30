const mongoose = require('mongoose');
const { requiredString, uniqueRequiredString } = require('./common.schema');
const moduleschema = mongoose.Schema({
  Modulename: requiredString,
  Moduleid: uniqueRequiredString,
  Moduleleader: requiredString,
});

const models = mongoose.model('modules', moduleschema);
module.exports = models;
