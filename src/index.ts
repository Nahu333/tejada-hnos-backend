import "reflect-metadata";
import express from "express";
import { ENV } from "@config/environment";
import { DatabaseService } from "@services/database.service";
import { errorHandler } from "@middlewares/error-handler.middleware";
import cors from "cors";

// Importar las funciones creadoras de rutas
import { createAuthRoutes } from "@routes/auth.routes";
import { createUserRoutes } from "@routes/user.routes";
import { createFieldRoutes } from "@routes/field.routes";
import { createPlotRoutes } from "@routes/plot.routes";
import { createActivityRoutes } from "@/routes/activity.routes";
import { createWorkOrderRoutes } from "./routes/work-order.routes";

const startServer = async () => {
  try {
    // 1. Inicializar la conexión a la base de datos y obtener el dataSource
    const dataSource = await DatabaseService.initialize();
    const app = express();

    // 2. Configurar Middlewares
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Si es una llamada de 'preflight' (OPTIONS), le decimos OK y listo.
  if (req.method === 'OPTIONS') {
    console.log('¡¡¡RECIBIDO PREFLIGHT (OPTIONS) Y APROBADO!!!');
    return res.sendStatus(200);
  }

  console.log('¡¡¡PERMISO DE CORS DADO!!!');
  next(); // Si no, que siga para las rutas
});
    app.use(express.json());

    // 3. Configurar Rutas, inyectando el dataSource
    app.use("/auth", createAuthRoutes(dataSource));
    app.use("/users", createUserRoutes(dataSource));
    app.use("/fields", createFieldRoutes(dataSource));
    app.use("/plots", createPlotRoutes(dataSource));
    app.use("/work-orders", createWorkOrderRoutes(dataSource));
    app.use("/activities", createActivityRoutes(dataSource));

    // 4. Configurar Error Handler (al final)
    app.use(errorHandler);

    // 5. Iniciar el servidor
    app.listen(ENV.PORT, () => {
      console.log(`🚀 ¡¡¡BACKEND LEVANTADO CON EL ARREGLO BRUTO!!! http://localhost:${ENV.PORT}`);
    });

  } catch (error) {
    console.error("❌ Error initializing the application:", error);
    process.exit(1);
  }
};

startServer();
