let contador = 0;
let carbonos = [];

function agregarCarbono() {
  const div = document.createElement("div");
  div.className = "carbono";
  div.innerText = "C";
  div.style.left = (50 + contador*60) + "px";
  div.style.top = "100px";
  div.draggable = true;

  div.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", contador);
  });

  document.getElementById("canvas").appendChild(div);
  carbonos.push(div);
  contador++;
  actualizarNombre();
}

function actualizarNombre() {
  let n = carbonos.length;
  let nombre = "---";
  if (n === 1) nombre = "Metano";
  else if (n === 2) nombre = "Etano";
  else if (n === 3) nombre = "Propano";
  else if (n === 4) nombre = "Butano";
  else if (n === 5) nombre = "Pentano";
  else if (n === 6) nombre = "Hexano";
  document.getElementById("nombre").innerText = nombre;
}

// Funciones de ejemplo para enlaces y ramificaciones
function agregarDobleEnlace() {
  document.getElementById("nombre").innerText += " (alqueno)";
}
function agregarTripleEnlace() {
  document.getElementById("nombre").innerText += " (alquino)";
}
function agregarRamificacion(tipo) {
  document.getElementById("nombre").innerText += ` con ramificación ${tipo}`;
}
function reiniciar() {
  // Vaciar arrays
  carbonos = [];
  enlaces = [];
  contador = 0;

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Borrar todos los divs de carbonos
  const canvasDiv = document.getElementById("canvas");
  canvasDiv.innerHTML = "";

  // Resetear el panel lateral
  document.getElementById("nombre").innerText = "---";
}

