import {Router} from 'express';
import {UserController} from '../controllers/UserController';
import {UserValidators} from '../validators/UserValidators';
import {GlobalMiddleWare} from '../middlewares/GlobalMiddleWare';

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
    }

    getRoutes() {
        this.router.get('/now', UserController.getCurrentTime);
        this.router.get('/me', GlobalMiddleWare.authenticate, UserController.userInfo)
    }

    postRoutes() {
        this.router.post('/register', UserValidators.register(), GlobalMiddleWare.checkError, UserController.register);
    }
}

export default new UserRouter().router;
