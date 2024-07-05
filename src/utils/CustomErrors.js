import Logger from "./Logger.js";
//_______________________________________Generic errors_______________________________________________________________________

export class InsufficientDataError extends Error {
  constructor(entity, requiredData) {
    super();
    this.message = `Insufficient required data for ${entity}: ${requiredData.map(
      (d) => d
    )}`;
    this.statusCode = 400;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________User Errors_______________________________________________________________________

export class UserNotFoundError extends Error {
  constructor() {
    super();
    this.message = "User not found in the database";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
//_______________________________________Restore password Errors_______________________________________________________________________

export class InvalidLinkError extends Error {
  constructor() {
    super();
    this.message = "Invalid link";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
export class AlreadyPasswordInUseError extends Error {
  constructor() {
    super();
    this.message = "Password is already in use, please choose another one";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________Product Errors_______________________________________________________________________

export class ProductNotFoundError extends Error {
  constructor() {
    super();
    this.message = "Product not found in the database";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________Cart Errors_______________________________________________________________________

export class CartNotFoundError extends Error {
  constructor() {
    super();
    this.message = "Cart not found in the database";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
export class CartNotCreatedError extends Error {
  constructor() {
    super();
    this.message = "The cart could not be created";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
export class ProductCartNotDeletedError extends Error {
  constructor() {
    super();
    this.message = "The product was not deleted from cart";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
export class CartNotUpdatedError extends Error {
  constructor() {
    super();
    this.message = "The cart was not updated";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
export class CartNotBuyError extends Error {
  constructor() {
    super();
    this.message = "The cart was not buy it";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
export class TicketNotCreatedError extends Error {
  constructor() {
    super();
    this.message = "The ticket was not created";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________Authentication Errors_______________________________________________________________________

export class AuthenticationError extends Error {
  constructor() {
    super();
    this.message = "Authentication failed";
    this.statusCode = 401;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________Authorization Errors_______________________________________________________________________

export class AuthorizationError extends Error {
  constructor() {
    super();
    this.message = "You are not authorized to perform this action";
    this.statusCode = 403; // Forbidden
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
