import {body, param, query} from 'express-validator';
import Game from '../models/Game';
import User from '../models/User';
import { Utils } from '../utils/Utils';
import constants = require('../config/constant');

export class GameValidators {
    static addPost() {
        return [body('content', 'Post Content is Required').isString()];
    }

    /***
     * this @function is middleware represented the valid 
    * play for the player in the given hour slots
     * 
    */

    static validToPlay(req, res, next){
        let cond = {
            user_id: req.user.user_id, 
            updated_at: {"$gte": new Date()}
        }
        Game.find(cond
            ).then(result => {
            if(result && result.length && result[0]["play_time_slots"].length >= constants.play_time_slots){
                res.send({'status_code': 406,'message':'Time slots exhausted. Please try after some time'});  
            }else if(result.length){
                req.user.exist = true;
                req.user._id = result[0]._id;
                req.user.user_name = req.user.username;
                req.user.points_added = result[0]["points_added"];
                req.user.points_total = result[0]["points_total"];
                next()
            }else{
                req.user.exist= false;
                next()
            }
        })
       
    }

    /***
     * this @function is middleware return the information
     * of last played game 
     * 
    */
    static lastPlayedGame(req, res, next){
        let cond = {
            user_id: req.user.user_id
        }
        Game.find(cond).sort({updated_at: -1}).limit(1).then(result => {
            if(result && result.length ){
                req.user.docId = result[0]._id;
                req.user.user_id = req.user.user_id;
                req.user.points_added = result[0]["points_added"];
                req.user.points_total = result[0]["points_total"];
                next();
            }else{
                res.send({'status_code': 406,'message':'Please first play the game'});  
            }
        })
       
    }

    /***
    * this @function is middleware represented the registration and last claim date 
    * 
    */
    static getLatestRegistrationBonusDate(req, res, next){
        console.log('latestRegistration', req.user);
        let cond = {
            _id: req.user.user_id
        }
        User.find(cond).then(result => {
            let minute;
            if(result && result.length ){
                let records = result[0];
                if(records['last_claim_date']){
                    let prev = records['last_claim_date'];
                    let future = new Date();
                    if(!Utils.compareDate(prev, future)){
                        res.send({'status_code': 406,'message':'This is not good time for claim'});  
                    }
                    minute = Utils.getMinute(future, prev);
                }else{
                    let prev = records['created_at'];
                    let future = new Date();
                    minute = Utils.getMinute(future, prev);
                }
                if(req.user["points_total"] > constants.max_points_limits || minute*constants.per_min_points > constants.max_points_limits||  req.user["points_total"] +minute*10 >10 ){
                    req.user["points_total"]  = constants.max_points_limits
                }else{
                    req.user["points_total"]  =  req.user["points_total"]  + minute*10;
                }
                req.user.last_claim_date = new Date();
                next();
            }else{
                res.send({'status_code': 406,'message':'Please first play the game'});  
            }
        })
    }

}
