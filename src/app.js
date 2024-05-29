//* LIB
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { default: helmet } = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const { v4: uuid } = require("uuid");

//* IMPORT
const { NODE_ENV, LIMIT_BODY } = require("./commons/constants");
const {
  app: { morgan: morganConfig, node },
} = require("./commons/configs/app.config");
const { errorHandler } = require("./commons/helpers/errorHandle");
const myLogger = require("./loggers/mylogger.log");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan(morganConfig));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  express.json({
    limit: LIMIT_BODY._5_MB,
  })
);

app.use((req, __, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId ? requestId : uuid();

  myLogger.log(`input params::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === "POST" ? req.body : req.query,
  ]);
  next();
});

//* Database & Cache
require("./databases/init.redis");

//* CORE
// require("./redis/subs/email.sub");

// * V1
app.use("/api/v1", require("./app/v1/routes"));

// * V2
app.use("/api/v2", require("./app/v2/routes"));

// * V3
app.use("/api/v3", require("./app/v3/routes"));

app.use((error, __, next) => {
  next(error);
});

app.use((error, req, res, ____) => {
  const checkNodeApp = node === NODE_ENV.DEV;
  try {
    const reqMessage = `${error.status} - ${
      Date.now() - error.now
    }ms - Response: ${JSON.stringify(error)}`;

    myLogger.error(reqMessage, [
      req.path,
      { requestId: req.requestId },
      req.method === "POST" ? req.body : req.query,
    ]);

    const resultError = errorHandler(error, checkNodeApp);

    return res.status(resultError?.response.status).json(resultError?.response);
  } catch (error) {
    const resultError = errorHandler(error, checkNodeApp);
    return res.status(resultError?.response.status).json(resultError?.response);
  }
});

module.exports = app;
