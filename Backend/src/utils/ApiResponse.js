class ApiResponse {
  constructor(statusCode, data, message = null) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;