import Logger from "../../src/utils/Logger.js";

const socket = io();
const products = document.getElementById("products");

function renderProducts(data) {
  products.innerHTML = data.map((p) => {
    return `<div class=" bg-white shadow-md rounded-md overflow-hidden mb-4 ">
          <div class="p-4">
              <h2 class="text-xl font-semibold">${p.title}</h2>
              <p class="text-gray-600">${p.description}</p>
              <p class="text-gray-800 font-bold">${p.price}</p>
              <p class="text-gray-600">Código: ${p.code}</p>
              <p class="text-gray-600">Stock: ${p.stock}</p>
              <p class="text-gray-600">Categoría: ${p.category}</p>
              <p class="text-gray-600">ID: ${p._id}</p>
          </div>
      </div>`;
  });
}

socket.on("products", (data) => {
  Logger.info("carga inicial: ", data);
  renderProducts(data);
});

socket.on("res", (data) => {
  Logger.info("socket data", data);
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
    .then((data) => {
      Logger.info("Respuesta del servidor:", data);
    })
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
