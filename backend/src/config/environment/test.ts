// config/environment/test.ts
export default () => ({
    isProduction: false,
    debug: false,
    apiUrl: 'http://localhost:5000/api/v1',
    database: {
      url: 'memory',
    },
  });