import * as express from 'express';
import {getEnvironmentVariables} from './environments/env';
import * as mongoose from 'mongoose';
import userRouter from './routers/UserRouter';
import gameRouter from './routers/GameRouter';
import bodyParser = require('body-parser');

export class Server {
    public app: express.Application = express();

    constructor() {
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }

    setConfigurations() {
        this.connectMongoDb();
        this.configureBodyParser();
    }

    connectMongoDb() {
        const databaseUrl = getEnvironmentVariables().db_url;
        mongoose.set('useFindAndModify', false);
        mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log('connected to database');
        }).catch((e)=>{
            console.log(`Not connected database ${e}`);

        });
    }

    configureBodyParser() {
        this.app.use(bodyParser.json({limit: '500mb'}));
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    setRoutes() {
        this.app.use('/api', userRouter);
        this.app.use('/api/game', gameRouter);
    }

    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: 'Not Found',
                status_code: 404
            });
        })
    }

    handleErrors() {
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || 'Something Went Wrong. Please Try Again',
                status_code: errorStatus
            })
        })
    }
}
