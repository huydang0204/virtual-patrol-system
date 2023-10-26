import dotenv from "dotenv";
dotenv.config();

const { API_BASE_URL } = process.env;

export const configuration = {
  API_BASE_URL,
  HEADER_AUTHORIZATION_PARAM_NAME : "Authorization"
};