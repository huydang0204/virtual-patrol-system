import express from "express";

import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { configuration } from "config";
import swaggerDocument from "./swagger.json";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));

const options = {
  explorer : true,
  validatorUrl : null
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options)
);

app.listen(configuration.port, () => {
  console.log(`Swagger is running on port ${ configuration.port }`);
});
