const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');

function addMessage(content, user) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(user);
    messageElement.innerText = content;
    messages.appendChild(messageElement);
    messages.scrollTo(0, messages.scrollHeight);
}

/* VERSION 1.0 */
// async function sendMessage(message) {
//     try {
//         const response = await fetch('/api/chatbot', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ message })
//         });

//         if (!response.ok) {
//             throw new Error('Error en la respuesta');
//         }

//         const data = await response.json();
//         addMessage(data.reply, 'bot');
//     } catch (error) {
//         console.error('Error al enviar el mensaje:', error);
//     }
// }
/* end VERSION 1.0 */

/* VERSION 1.5 */
async function sendMessage(message) {
    try {
        const context = `Eres un bot de respuestas. Tengo una página web de _ llamada _ dónde vas a responder cualquier pregunta relacionada a estos temas: Teléfono de la empresa: 123456789, procedimiento de pedido: delivery, tipos de productos: frutas, verduras, tubérculos, procedimiento de reclamo: rápido y fácil.`;

        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, context })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error en la respuesta: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        addMessage(data.reply, 'bot');
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}
/* end VERSION 1.5 */

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    messageInput.value = '';

    sendMessage(message);
});