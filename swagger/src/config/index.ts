import dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  ENV
} = process.env;

const configuration = {
  port : PORT,
  env : ENV
};

export { configuration };
