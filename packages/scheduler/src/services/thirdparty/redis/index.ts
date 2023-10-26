import { createClient } from "redis";
import { configuration } from "config/index";
import { logger } from "services/logger";

const redisClient = createClient({ url : `${ configuration.redisHost }` });
redisClient.on("error", (err : never) => logger.error("[services/thirdparty/redis] Redis Client Error", err));

redisClient.connect().then(() => logger.info("Redis connected"));

export { redisClient };
