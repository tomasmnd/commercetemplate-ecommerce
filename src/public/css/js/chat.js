import Logger from "../../../utils/Logger.js";

const socket = io();
const recivedMessages = document.getElementById("recivedMessages");
alert("script");

function renderMessages(data) {
  recivedMessages.innerHTML = data.map((m) => {
    return ` <ul>
                 <li>
                 ${m.message}
                 </li>
             </ul>`;
  });
}

socket.on("messages", (data) => {
  renderProducts(data);
});

socket.on("res", (data) => {
  renderProducts(data);
  clearForm();
});

function sendNewProduct() {
  const formData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: document.getElementById("price").value,
    status: document.getElementById("status").checked,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
  };

  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      Logger.error("Error al enviar datos:", error);
    });
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("code").value = "";
  document.getElementById("price").value = "";
  document.getElementById("status").checked = false;
  document.getElementById("stock").value = "";
  document.getElementById("category").value = "";
}
