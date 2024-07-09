// Importaciones
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import "dotenv/config";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

import loggerRouter from "./src/controller/logger.controller.js";
import cart from "./src/routes/cart.routes.js";
import products from "./src/routes/products.routes.js";
import routerSessions from "./src/routes/sessions.routes.js";
import usersRouter from "./src/routes/user.routes.js";
import passwordReset from "./src/routes/passwordReset.routes.js";
import views from "./src/routes/views-routes.js";
import ProductsDao from "./src/dao/productDao.js";
import Logger from "./src/utils/Logger.js";
import initializaPassport from "./src/utils/passport.config.js";
import swaggerDocs from "./src/config/swagger.config.js";

// Servidor Http
const app = express();
const httpServer = app.listen(process.env.PORT || 3000, () => {
  Logger.info(`Server running at port ${process.env.PORT}`);
});
let productos;

// Inicialización de datos
const initialData = async () => {
  productos = await ProductsDao.getAllProducts();
};

// Conexión a la base de datos
const uri = process.env.MONGO_URI;
mongoose.set("strictQuery", false);

mongoose.connect(uri).then(
  () => {
    Logger.info("Conectado a DB");
  },
  err => {
    Logger.fatal(err);
  }
);

// Middleware
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: uri,
      ttl: 60 * 60 * 24,
    }),
  })
);
initializaPassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", products);
app.use("/api/carts", cart);
app.use("/api/sessions", routerSessions);
app.use("/api/users", usersRouter);
app.use("/api/loggerTest", loggerRouter);
app.use("/api/password-reset", passwordReset);
app.use("/", views);

//Swagger!
swaggerDocs(app);

// Configuración de templates de vistas
const __dirname = dirname(fileURLToPath(import.meta.url));

// Creación de la instancia de Handlebars con helpers personalizados
const exphbs = handlebars.create({
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.engine('handlebars', exphbs.engine);
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");
