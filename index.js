const juegos = [
  { id: 1, nombre: 'Sonic', precio: 25000 },
  { id: 2, nombre: 'Mario', precio: 12000 },
  { id: 3, nombre: 'Pokémon', precio: 38000 },
  { id: 4, nombre: 'Zelda', precio: 26000 },
  {id: 5, nombre: 'Lolcito', precio: 30000 }
];

const carrito = [];

const productosDiv = document.getElementById('productos');
const carritoUL = document.getElementById('carrito');
const totalSpan = document.getElementById('total');
const contadorSpan = document.getElementById('contador');

function renderizarProductos() {
  juegos.forEach(juego => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
        <h3>${juego.nombre}</h3>
        <p>Precio: $${juego.precio}</p>
        <button onclick="agregarAlCarrito(${juego.id})">Agregar al carrito</button>
      `;
    productosDiv.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const juego = juegos.find(j => j.id === id);
  carrito.push(juego);
  actualizarCarrito();
}

function actualizarCarrito() {
  carritoUL.innerHTML = '';
  let total = 0;
  carrito.forEach(juego => {
    const li = document.createElement('li');
    li.textContent = `${juego.nombre} - $${juego.precio}`;
    carritoUL.appendChild(li);
    total += juego.precio;
  });
  totalSpan.textContent = total;
  contadorSpan.textContent = carrito.length;
}

function vaciarCarrito() {
  if (carrito.length === 0) return;
  if (confirm('¿Estás segura de que quieres vaciar el carrito?')) {
    carrito.length = 0;
    actualizarCarrito();
  }
}

// function simularPago() {
//   const total = carrito.reduce((sum, j) => sum + j.precio, 0);
//   const cantidad = carrito.length;
//   alert(`Simulación de pago por $${total} CLP\nCantidad de juegos: ${cantidad}\n`);

// }
async function simularPago() {
  const total = carrito.reduce((sum, j) => sum + j.precio, 0);
  const cantidad = carrito.length;

  if (cantidad === 0) {
    alert("Agrega al menos un juego al carrito");
    return;
  }
  // Crea los datos del pago
  const datosPago = {
    "amount": total,
    "currency": "CLP",
    "subject": "Cobro de los juegos"
  };

  try {
    const respuesta = await fetch("https://payment-api.khipu.com/v3/payments", {
      method: "POST",
      headers: {
        "x-api-key": "5268a3a1-993c-4dd0-8e2e-c89b6ad98e92",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosPago)
    });

    const resultado = await respuesta.json();
    console.log(resultado.data)
    if (resultado.payment_url) {
      // Abre ventana con medios de pago

      // window.open(resultado.payment_url, "_blank");

      // Aquí simulas la URL que te devolvería la API de Khipu
      // En producción, este link lo obtienes desde el backend con tu integración real
      const khipuURL = resultado.payment_url;

      // Mostramos el iframe y asignamos la URL
      const iframeContainer = document.getElementById("khipuFrameContainer");
      const iframe = document.getElementById("khipuIframe");

      iframe.src = khipuURL;
      iframeContainer.style.display = "block";

    } else {
      alert("Error al generar pago");
      console.error(resultado);
    }
  } catch (error) {
    alert("ERROR EN EL LLAMADO A KHIPU")
    console.error("Error al crear el pago:", error);
  }
}



renderizarProductos();