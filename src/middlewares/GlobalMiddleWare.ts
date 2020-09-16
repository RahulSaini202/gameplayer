import {validationResult} from 'express-validator';
import * as Jwt from 'jsonwebtoken';
import {getEnvironmentVariables} from '../environments/env';
let constants = require('../config/Constant');

export class GlobalMiddleWare {
    /***
     * this @function is middleware represented the error handling
     * 
     */

    static checkError(req, res, next) {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            next(new Error(error.array()[0].msg));
        } else {
            next();
        }
    }
     /***
     * this @function is middleware represented the authentication
     * 
     */
    static async authenticate(req, res, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
        try {
            Jwt.verify(token, getEnvironmentVariables().jwt_secret, ((err, decoded) => {
                if (err) {
                    next(err)
                } else if (!decoded) {
                    req.errorStatus = 401;
                    next(new Error('User Not Authorised'))
                } else {
                    req.user = decoded;
                    next();
                }
            }))
        } catch (e) {
            req.errorStatus = 401;
            next(e);
        }
    }
     /***
     * this @function is middleware represented the authentication on restrictions of APIs
     * 
     */
    static async restricatedApiAuthenticate(req, res, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
        if(token){
            try {
                Jwt.verify(token, getEnvironmentVariables().jwt_secret, ((err, decoded) => {
                    if (err) {
                        next(err)
                    } else if (!decoded) {
                        req.errorStatus = 401;
                        next(new Error('User Not Authorised'))
                    } else {
                        req.user = decoded;
                        next();
                    }
                }))
            } catch (e) {
                req.errorStatus = 401;
                next(e);
            }
        }else{
            next();
        }
    }
}
