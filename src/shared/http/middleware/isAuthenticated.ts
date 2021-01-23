import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken'
import AppError from "@shared/errors/AppError";
import authConfig from '@config/auth'

interface ITokenPayload {
  iat: number,
  exp: number,
  sub: string
}
export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    console.log('JWT Token is missing.')
    throw new AppError('JWT Token is missing.');
  }

  const [, token] = authHeader.split(' ');

  verify(token, authConfig.jwt.secret, (err, decodedToken) => {

    if (err === null) {
      const { sub } = decodedToken as ITokenPayload;
      request.user = {
        id: sub,
      }
      return next();
    }

    if (err.name === 'TokenExpiredError') {
      throw new AppError('Whoops, your token has expired!', 401);
    }

    if (err.name === 'JsonWebTokenError') {
      throw new AppError('That JWT is malformed!', 401);
    }

    throw new AppError('Invalid JWT Token.', 401);

  });

}
