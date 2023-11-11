const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const openai = require('openai');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

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
        // console.error(error); --> Más fácil de explicar para cursos
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});
/* end VERSION 1.5 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));