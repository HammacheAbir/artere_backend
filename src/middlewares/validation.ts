import z from 'zod';
import {Request,Response,NextFunction} from "express"

export const validateRequest = (schema: z.ZodObject<any,any>) => (req:Request, res:Response, next:NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e:any) {
    return res.status(400).json({
      message: "Validation Error",
      errors: e.errors,
    });
  }
};

module.exports = validateRequest;
