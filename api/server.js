// api/server.js
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

// Conexão MongoDB Atlas
const uri = process.env.MONGODB_URI; // Defina no Vercel como variável de ambiente
const client = new MongoClient(uri);
let db;

// Função para conectar ao banco (lazy connection)
async function connectDB()
{
  if (!db) {
    await client.connect();
    db = client.db("portfolio"); // nome do banco
  }
  return db;
}

// Handler principal
export default async function handler(req, res)
{
  const db = await connectDB();
  const visitas = db.collection("visitas");

  // Gera ou recupera UUID do usuário
  let userUUID = req.headers["x-user-uuid"];
  if (!userUUID) {
    userUUID = uuidv4();
  }

  if (req.method === "POST")
  {
    // Atualiza contador global
    await visitas.updateOne(
      { tipo: "global" },
      { $inc: { total: 1 } },
      { upsert: true }
    );

    // Atualiza contador por usuário
    await visitas.updateOne(
      { tipo: "usuario", uuid: userUUID },
      { $inc: { total: 1 } },
      { upsert: true }
    );

    const global = await visitas.findOne({ tipo: "global" });
    const usuario = await visitas.findOne({ tipo: "usuario", uuid: userUUID });

    res.status(200).json({
      global: global.total,
      usuario: usuario.total,
      uuid: userUUID,
    });
  } else if (req.method === "GET")
        {
            const { uuid } = req.query;
            const global = await visitas.findOne({ tipo: "global" });
            const usuario = await visitas.findOne({ tipo: "usuario", uuid });

            res.status(200).json({
            global: global?.total || 0,
            usuario: usuario?.total || 0,
            });
  } else
    {
        res.status(405).json({ error: "Método não permitido" });
    }
}
