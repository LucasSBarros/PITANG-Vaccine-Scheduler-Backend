import express from "express";
import cors from "cors";
import helmet from "helmet";
import pacientRoutes from "./routes/pacient.router.mjs";
import scheduleRoutes from "./routes/schedule.router.mjs";

const server = express();
const PORT = process.env.PORT || 3000;

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(pacientRoutes);
server.use(scheduleRoutes);

server.use("*", (request, response) => {
  response.status(404).send({ message: "Rota não encontrada" });
});

server.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});

export default server;
