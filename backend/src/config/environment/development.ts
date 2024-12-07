import { AppEnum } from "src/common/enums/app.enum";

// config/environment/development.ts
export default () => ({
    isProduction: false,
    debug: true,
    baseUrl: process.env.BASE_URL || AppEnum.BASE_URL,
    apiUrl: process.env.API_URL || `${AppEnum.BASE_URL}/${AppEnum.API_PREFIX}`,
  });
  