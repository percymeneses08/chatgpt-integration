const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input")
const messages = document.getElementById("messages")

function addMessage(content, user)
{
  const messageElement = document.createElement("div")
  messageElement.classList.add(user)
  messageElement.innerText = content
  messages.appendChild(messageElement)
  messages.scrollTo(0, messages.scrollHeight)
}

async function sendMessage(message)
{
  try {
    const context = "Eres un bot de respuestas. Tengo una página web dónde vas a responder cualquier pregunta relacionada a estos temas: Teléfono de la empresa: 123456789, procedimiento de pedido: delivery, tipos de productos: frutas, verduras, tubérculos, procedimiento de reclamo: a través de un correo interno."
    const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message, context })
    });

    if (!response.ok)
    {
      const errorText = await response.text();
      throw new Error("Error en la respuesta: " + response.status + " " + errorText);
    }
    
    const data = await response.json();
    addMessage(data.reply, "bot");
  }
  catch (error)
  {
    console.error("Error al enviar el mensaje:", error);
  }
}

messageForm.addEventListener("submit", handleSubmit)

function handleSubmit(event)
{
  event.preventDefault()
  const message = messageInput.value.trim()

  if (!message) return

  addMessage(message, "user")
  messageInput.value = ""

  sendMessage(message)
}

  