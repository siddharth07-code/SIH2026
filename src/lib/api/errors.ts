export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, status = 500, code = "API_ERROR", details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends ApiClientError {
  constructor(message = "Network connection failure. Unable to reach API server.") {
    super(message, 0, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

export class TimeoutError extends ApiClientError {
  constructor(message = "Request timed out while waiting for server response.") {
    super(message, 408, "TIMEOUT_ERROR");
    this.name = "TimeoutError";
  }
}

export class ValidationError extends ApiClientError {
  constructor(message = "Response schema validation failed.", details?: unknown) {
    super(message, 422, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ApiClientError {
  constructor(message = "Authentication required or session expired.") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApiClientError {
  constructor(message = "Insufficient permissions to perform this action.") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends ApiClientError {
  constructor(message = "The requested resource was not found.") {
    super(message, 404, "NOT_FOUND_ERROR");
    this.name = "NotFoundError";
  }
}
