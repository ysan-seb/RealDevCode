const bodyParser = require('body-parser');
const express = require('express');
const config = require('Config')


class Server {

  app: any;
  port: any;
  httpStatus: any;
  
  constructor(controllers : any, port : number) {
    this.app = express();
    this.port = port;
    this.initialize();
    this.initializeControllers(controllers);
  }

  initialize = () => {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use((err, req, res, next) =>
      res.status(err.status).json({
        message: err.isPublic ? err.message : this.httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {},
      }),
    );
  }

  initializeControllers = (controllers) => {
    const router = express.Router();
    router.get('/health-check', (req, res) => res.send('OK'));
    controllers.forEach(controller => {
      router.use(controller.path, controller.routes);
    });
    this.app.use(router);
  }

  start() {
    this.app.listen(this.port, () => {
      console.info(`Server started on http://localhost:${this.port}`);
    });
  }
}

export = Server