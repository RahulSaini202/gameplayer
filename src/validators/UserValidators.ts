import {check,body, query} from 'express-validator';
import User from '../models/User';

/***
 * this @function is middleware represented the user validation
 * 
 */
export class UserValidators {
    static register() {
        return [body('username', 'username is Required').isString().custom((username, {req}) => {
            return User.findOne({username: username.toLowerCase()}).then(user => {
                if (user) {
                    throw new Error('User Already Exist');
                } else {
                    return true;
                }
            })
        })]; 
    }

}


