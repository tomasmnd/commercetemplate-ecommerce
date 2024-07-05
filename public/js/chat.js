import Logger from "../../src/utils/Logger.js";

const socket = io();
const recivedMessages = document.getElementById("recivedMessages");

socket.on("messages", (data) => {
  Logger.info("carga inicial: ", data);
  renderMessages(data);
});

socket.on("res", (data) => {
  Logger.info("socket data", data);
  renderMessages(data);
});

function renderMessages(data) {
  recivedMessages.innerHTML = data.map((m) => {
    return `<div class="flex justify-center mb-2">
    <div class="bg-white shadow-md rounded-lg overflow-hidden w-1/4">
        <div class="p-2">
            <h2 class="text-xl font-semibold">${m.user}</h2>
            <p class="text-gray-600">${m.message}</p>
        </div>
    </div>
</div>
`;
  });
}
function sendNewMessage() {
  const formData = {
    message: document.getElementById("messageBox").value,
    user: document.getElementById("email").value,
  };

  fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      Logger.info("Respuesta del servidor:", data);
    })
    .catch((error) => {
      Logger.error("Error al enviar datos:", error);
    });
}

function clearForm() {
  document.getElementById("messasgeBox").value = "";
}
