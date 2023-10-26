import { defineConfig } from "cypress";
import * as constants from "./cypress/support/constants";

export default defineConfig({
  e2e : {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth : 1480,
    viewportHeight : 1080,
    scrollBehavior : false
  },
  env : {
    CYPRESS_LocalStorageAuthKey : constants.LOCAL_STORAGE_AUTH_KEY,
    CYPRESS_LoginPath : constants.LOGIN_PATH,
    CYPRESS_LogoutPath : constants.LOGOUT_PATH,
    CYPRESS_AnalyticsPath : constants.ANALYTICS_PATH,
    CYPRESS_API_URL : constants.API_BASE_URL
  }
});
