const express = require("express")
const axios = require("axios")
const dotenv = require("dotenv")
const path = require("path")
const openai = require("openai")

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname)))

function handleGet(req, res)
{
  res.sendFile(path.join(__dirname, "index.html"))
}
app.get("/", handleGet)

openai.apiKey = process.env.OPENAI_API_KEY

async function handlePost(req, res)
{
  try
  {
    const { message, context } = req.body

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        messages: [
          { role: "system", content: `${context}` },
          { role: "user", content: `${message}` }
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 100,
        n: 1,
        temperature: 0.8,
      },
      {
        headers: {
          "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
          "Content-Type": "application/json"
        }
      }
    )

    const reply = response.data.choices[0].message.content.trim()
    res.json({ reply })

  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud", details: error.message })
  }
}
app.post('/api/chatbot', handlePost)

const PORT = process.env.PORT || 3000
function serverMessage()
{
  console.log("Servidor iniciado en el puerto " + PORT)
}

app.listen(PORT, serverMessage)