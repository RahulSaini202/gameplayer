import {Router} from 'express';
import{GameValidators} from '../validators/GameValidators';
import {GameController} from '../controllers/GameController';
import {GlobalMiddleWare} from '../middlewares/GlobalMiddleWare';

class GameRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
 
    }


    getRoutes() {
        this.router.get('/leaderboard', GlobalMiddleWare.restricatedApiAuthenticate, GameController.getLeaderboard);
    }

    postRoutes() {
        this.router.post('/play', GlobalMiddleWare.authenticate, GlobalMiddleWare.checkError, 
        GameValidators.validToPlay, GameController.addGame);

       this.router.post('/claim-bonus', GlobalMiddleWare.authenticate, GlobalMiddleWare.checkError, 
       GameValidators.lastPlayedGame , GameValidators.getLatestRegistrationBonusDate, GameController.claimBonus);
    }

}

export default new GameRouter().router;
