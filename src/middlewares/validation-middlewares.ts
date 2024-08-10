import { NextFunction, Request, Response } from "express";
import Joi, { custom } from "joi";

interface IValidator {
  params?: Joi.Schema;
  query?: Joi.Schema;
  body?: Joi.Schema;
  headers?: Joi.Schema;
}

export class Validator {
  static schema: IValidator;

  static validate(
    req: Request,
    res: Response,
    next: NextFunction,
    schema: IValidator
  ) {
    return this.makeValidation(req, res, next, schema);
  }

  static makeValidation(
    req: any,
    res: Response,
    next: NextFunction,
    schema: any
  ) {
    const errors: any[] = [];

    Object.keys(schema).map((k) => {
      const { error } = schema[k].validate(req[k]);

      if (error) errors.push({ type: `${k} validation`, error: error.message });

      return k;
    });

    if (errors.length === 0) {
      return next();
    }

    return res.status(400).send({ message: "Validation Error", errors });
  }
}
export class ValidationMiddlewares extends Validator {
  static login = (req: Request, res: Response, next: NextFunction) => {
    const schema = {
      body: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
      })
    };

    return this.validate(req, res, next, schema);
  };

  static createUser = (req: Request, res: Response, next: NextFunction) => {
    const schema = {
      body: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().length(8)
      })
    };

    return this.validate(req, res, next, schema);
  };

  static resetPassword = (req: Request, res: Response, next: NextFunction) => {
    const schema = {
      body: Joi.object({
        email: Joi.string().required().email(),
        newPassword: Joi.string().required().min(8).max(15),
        oldPassword: Joi.string().required().min(8).max(15)
      })
    };

    return this.validate(req, res, next, schema);
  };

  static validateTokenPattern = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = {
      headers: Joi.object({
        authorization: Joi.string()
          .required()
          .pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
          .required()
          .messages({
            "string.pattern.base":
              "The authorization field must follow the pattern: Bearer <token>",
            "any.required": "authorization field is required"
          })
      }).unknown(true)
    };

    return this.validate(req, res, next, schema);
  };

  static validateShortId = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = {
      params: Joi.object({
        shortUrlId: Joi.string().required().uuid()
      })
    };

    return this.validate(req, res, next, schema);
  };

  static validateShortIdVisit = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = {
      params: Joi.object({
        shortId: Joi.string()
          .pattern(/^[a-zA-Z0-9]{6}$/)
          .required()
          .messages({
            "string.pattern.base":
              "The string must be exactly 6 alphanumeric characters."
          })
      })
    };

    return this.validate(req, res, next, schema);
  };
  static validateRedirectUrl = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = {
      body: Joi.object({
        redirectUrl: Joi.string()
          .required()
          .uri({ scheme: ["http", "https"] })
      })
    };

    return this.validate(req, res, next, schema);
  };
}
