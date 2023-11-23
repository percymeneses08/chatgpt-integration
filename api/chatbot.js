const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const openai = require('openai');

// Explicación: Importamos las librerías necesarias para construir la aplicación.
dotenv.config();

// Explicación: Configuramos una aplicación Express, indicamos el uso de JSON y archivos estáticos.
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Explicación: Configuramos una ruta para manejar peticiones GET a la raíz y enviar el archivo 'index.html'.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Explicación: Configuramos la clave de la API de OpenAI utilizando la clave almacenada en las variables de entorno.
openai.apiKey = process.env.OPENAI_API_KEY;

/* VERSION 1.0 solo respuestas de chatGTP */
// app.post('/api/chatbot', async (req, res) => {
//     const { message } = req.body;

//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/completions',
//             {
//                 model: 'text-davinci-003',
//                 prompt: message,
//                 max_tokens: 100,
//                 n: 1,
//                 stop: null,
//                 temperature: 0.8,
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         const reply = response.data.choices[0].text.trim();
//         res.json({ reply });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error al procesar la solicitud' });
//     }
// });
/* end VERSION 1.0 solo respuestas de chatGTP */

/* VERSION 1.5 */
/* Explicación: Configuramos una ruta para manejar peticiones POST a '/api/chatbot'.
Utilizamos la API de OpenAI para obtener respuestas basadas en el mensaje y el contexto proporcionados.*/
app.post('/api/chatbot', async (req, res) => {
    try {
        const { message, context } = req.body;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                messages: [
                    { role: 'system', content: `${context}` },
                    { role: 'user', content: `${message}` }
                ],
                model: 'gpt-4-vision-preview',
                max_tokens: 100,
                n: 1,
                temperature: 0.8,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply = response.data.choices[0].message.content.trim();
        
        res.json({ reply });

    } catch (error) {
        // console.error(error); <-- Más fácil de explicar para cursos
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al procesar la solicitud', details: error.message });
    }
});
/* end VERSION 1.5 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));