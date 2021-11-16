/**
 * Provide a specific error class so that consuming code can
 * .. check whether a thrown error came from here
 * Extend Error to ensure stack trace https://javascript.info/custom-errors
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}


module.exports = ValidationError;
