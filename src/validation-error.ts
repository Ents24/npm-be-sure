/**
 * Provide a specific error class so that consuming code can
 * .. check whether a thrown error came from here
 * Extend Error to ensure stack trace https://javascript.info/custom-errors
 */
export default class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
