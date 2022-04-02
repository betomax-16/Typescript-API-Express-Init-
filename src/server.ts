import express, { Application } from "express";
import router from "./routes";
import routerApiV1 from "./routes/api/v1/api";
import swaggerUi = require('swagger-ui-express');
import { getEnv } from "./enviroment";
import cors from "cors";
import path from "path";
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
        console.log(process.env.PORT);
    }

    private config(): void {
        getEnv();
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false}));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(router);
        this.app.use('/api/v1', routerApiV1);
        this.app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(this.swaggerDocument, undefined, undefined, this.customCss));
    }
}

export default new Server().app;