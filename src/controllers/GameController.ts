import Game from '../models/Game';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import { Utils } from '../utils/Utils';

export class GameController {
    /***
     * this @function is respresented the game which is play by player in which
     * to add random points 
     */
    static async addGame(req, res, next) {
        const userId = req.user.user_id;
        const points_added = Utils.generateRandomNumber();
        const  points_total  = (req.user && req.user.points_total) ? req.user.points_total + points_added : points_added;

        try{
            if(req.user.exist){
                let updateData = {'$set': {}, '$push':{}};
                updateData.$set["user_id"] =  userId;
                updateData.$set["points_added"] =  points_added;
                updateData.$set["points_total"] =  points_total;
                updateData.$push["play_time_slots"] = new Date();
              
                let result = await Game.update({_id: req.user._id}, updateData,{new: true, upsert: true});
                if(result){
                    res.send({'status_code':200,'message':'succesfully update the data', 'result': {
                        'points_added': points_added,
                        'points_total': points_total
                    }});  
                }
            }else{
                const inputData = {
                    _id : uuidv4(),
                    user_id: userId,
                    user_name :  req.user.username,
                    points_added: points_added,
                    points_total:points_total,
                    play_time_slots:  [new Date()],
                    created_at: new Date(),
                    updated_at :  new Date(Utils.getHourDateTime(1))
                   
                };
                let result = await new Game(inputData).save();
                res.send({'status_code':200,'message':'succesfully saved the result', 'result': {
                    'points_added': result["points_added"],
                    'points_total': result["points_total"]
                }});  
            }
        }
        catch(e){
            res.send({'status_code':500,'message':'something went wrong', 'result': e});  
        }   
    }

    /***
     * this @function is respresented the 
     * claim the bouns points
     */

    static async claimBonus(req, res, next) {
        try{
            console.log("final", req.user);
            let gameResponse  = await Game.update({'_id': req.user.docId},{$set:{'points_total': req.user.points_total}});
            console.log("gameResponse", gameResponse);
            let userResponse = await User.update({'_id': req.user.user_id},{$set:{'last_claim_date': req.user.last_claim_date}});
            console.log("userResponse", userResponse);

            res.send({'status_code':200,'message':'successfully update', 'result': {
                'points_total':req.user.points_total,
                'points_added': req.user.points_added
            }});  
        }
        catch(e){
            res.send({'status_code':500,'message':'something went wrong', 'result': e});  
        }   
    }
    
    /***
     * this @function is respresented the 
     * ranking order of player w.r.t points
     */

    static async getLeaderboard(req, res, next) {
        try {
            await Game.aggregate([
                {
                    $group: {
                      _id: "$user_name",
                      points_total: {
                        $sum: "$points_total"
                      }
                    }
                  },
                  {
                    $sort: {
                      points_total: -1
                    }
                  },
                  {
                    $group: {
                      _id: null,
                      users: {
                        $push: {
                          user_name: "$_id",
                          points_total: "$points_total"
                        }
                      }
                    }
                  },
                {
                    "$unwind": {
                      "path": "$users",
                      "includeArrayIndex": "users.rank"
                    }
                },
                {
                    $replaceRoot: {
                      newRoot: "$users"
                    }
                },
                {
                    $addFields: {
                      rank: {
                        $add: [
                          "$rank",
                          1
                        ]
                      }
                    }
                }
            ]).then(function(dta){
                let tempData = dta;
                if(req.user && req.user.user_id){
                    tempData = dta.filter(function(result){
                        if(result.user_name == req.user.username){
                            return result;
                        }
                    })
                }
                res.send({'status_code':200,'message':'successfully fetch the result', 'result':tempData});  
            }).catch(function(e){
                res.send({'status_code':500,'message':'something went wrong', 'result':e});  
            })
        } catch (e) {
          res.send({'status_code':500,'message':'something went wrong', 'result':e});  
        }
    }
}
