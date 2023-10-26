import { MainApplication } from "./app";
import os from "os";

process.env.UV_THREADPOOL_SIZE = os.cpus().length as unknown as string;

const mainApplication = new MainApplication();
mainApplication.start();

export default mainApplication.app;