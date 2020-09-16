import User from '../models/User';
import {Utils} from '../utils/Utils';
import * as Jwt from 'jsonwebtoken';
import {getEnvironmentVariables} from '../environments/env';
import { v4 as uuidv4 } from 'uuid';
import { UserValidators } from '../validators/UserValidators';


export class UserController {
    /***
     * this @function is return the current server time.
    */
    static async getCurrentTime(req, res, next) {
        res.send({'status_code':200,'message':'succesfully fetch the data', 'result': {'timestamp': Utils.getCurrentTime()}});  
        
    }

    /***
     * this @function is store the details of the player.
    */

    static async register(req, res, next) {
        const username = (req.body.username).toLowerCase();
        try {
            const inputData = {
                _id : uuidv4(),
                username: username,
                // created_at: new Date(),
                // updated_at: new Date()
            };
            let user = await new User(inputData).save();
            const token = Jwt.sign({username: username, user_id: user._id}, getEnvironmentVariables().jwt_secret, {expiresIn: '120d'});

            const data = {token: token};
            res.send({'status_code':200,'message':'succesfully fetch the token', 'result': data});  
        } catch (e) {
            res.send({'status_code':500,'message':'something went wrong', 'result':e}); 
        }
    }
   
    /***
     * this @function is return the user information
    */

    static async userInfo(req, res, next) {
        try {
            await User.aggregate([
                {
                    $match: {
                        _id: req.user.user_id
                    }},
                    {
                        $lookup:
                          {
                            from: 'games',
                            localField: "_id",
                            foreignField: "user_id",
                            as: "userData"
                    }
                }
                   
            ]).exec(function(err, dta){
               if(err){
                    res.send({'status_code':500,'message':'something went wrong', 'result':err}); 
               }else{
                    
                    let infoData = {
                        '_id': req.user.user_id,
                        'user_name': req.user.username,
                        'total_points': 0
                    }
                    if(dta && dta.length && dta[0].userData && dta[0].userData.length){
                        let sum = 0;
                        let tempData = dta[0].userData.map(function(elem){
                            sum = sum + elem.points_total
                        })
                        infoData["total_points"] = sum;
                        res.send({'status_code':200,'message':'successfully return data', 'result':infoData}); 

                    }else{
                        res.send({'status_code':200,'message':'successfully return data', 'result':infoData}); 
                    }   
               }
            })
        } catch (e) {
            res.send({'status_code':500,'message':'something went wrong', 'result':e}); 
        }
    }

}
