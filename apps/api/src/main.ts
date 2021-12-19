import http from 'http';
import createApp from './app/app';

/**
 * Start Express server.
 */
let server: http.Server;
(async () => {
  try {
    const app = await createApp();
    server = app.listen(app.get('port'), () => {
      console.info(
        `App is running at http://localhost:${app.get('port')} in ${app.get(
          'env'
        )} mode`
      );
    });

    server.keepAliveTimeout = 61 * 1000;
  } catch (err) {
    console.error(err, {}, 'Error while starting server');
  }
})();

const startGracefulShutdown = () => {
  if (server !== undefined) {
    console.info({}, 'Closing server');
    server.close(() => {
      console.info({}, 'Express server closed!');
    });
  }
  // Force close after 2s
  setTimeout(() => {
    process.exit();
  }, 2000);
};

process.on('SIGTERM', startGracefulShutdown);
process.on('SIGINT', startGracefulShutdown);
