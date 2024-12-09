import { AppEnum } from "src/common/enums/app.enum";

// config/environment/production.ts
export default () => ({
    isProduction: true,
    debug: false,
    baseUrl: process.env.BASE_URL,
    apiUrl: `${process.env.API_URL}/${AppEnum.API_PREFIX}`,
    clientUrl: process.env.CLIENT_URL || AppEnum.CLIENT_URL,
  });
  