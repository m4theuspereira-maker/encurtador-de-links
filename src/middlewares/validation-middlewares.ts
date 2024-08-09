import { NextFunction, Request, Response } from "express";
import Joi from "joi";

interface IValidator {
  params?: Joi.Schema;
  query?: Joi.Schema;
  body?: Joi.Schema;
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
        newPassword: Joi.string().required().length(8),
        oldPassword: Joi.string().required().length(8)
      })
    };

    return this.validate(req, res, next, schema);
  };
}
