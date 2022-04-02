import express, { Application } from "express";
import router from "./routes";
import routerApiV1 from "./routes/api/v1/api";
import swaggerUi = require('swagger-ui-express');
import { getEnv } from "./enviroment";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import mysql from "mysql";
import fs = require('fs');

class Server {
    public app: Application;

    /* Arrancan archivos Swagger */
    private swaggerFile: any = (process.cwd()+"\\swagger\\swagger.json");
    private swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
    private customCss: any = fs.readFileSync((process.cwd()+"\\swagger\\swagger.css"), 'utf8');
    private swaggerDocument = JSON.parse(this.swaggerData);

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        getEnv();

        this.connectDataBase();

        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false}));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(router);
        this.app.use('/api/v1', routerApiV1);
        this.app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(this.swaggerDocument, undefined, undefined, this.customCss));
    }

    private connectDataBase(): void {
        const con = mysql.createConnection({
            host: process.env.HOSTDB,
            user: process.env.USERDB,
            password: process.env.PASSDB,
            database: process.env.DB
        });
          
        con.connect((err: any) => {
            if (err) console.log('Connection error', err);
            console.log(`Connected to: ${process.env.HOSTDB}, DB: ${process.env.DB}`);
        });
    }
}

export default new Server().app;