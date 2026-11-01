import { app } from './app.js';
import { config } from './config/env.js';

const server = app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT} (${config.NODE_ENV})`);
});

export default server;
