import app from "./server";
import { getEnv } from "./enviroment";

getEnv();
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`App started!!!`);
    console.log(`Mode: ${process.env.NODE_ENV} in Port: ${process.env.PORT}`);
});