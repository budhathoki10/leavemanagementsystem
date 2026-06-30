class errorHandler {
  constructor(success, statuscode, message, error = null, data = null) {
    this.success = success;
    this.statuscode = statuscode;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}

module.exports = errorHandler;
