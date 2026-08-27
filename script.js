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
  if (n === 0) {
    document.getElementById("nombre").innerText = "---";
    return;
  }

  // Calcular hidrógenos
  let totalH = calcularHidrogenos();

  // Fórmula molecular
  let formula = `C${n}H${totalH}`;

  // Prefijos IUPAC básicos
  const prefijos = ["", "Met", "Et", "Prop", "But", "Pent", "Hex", "Hept", "Oct", "Non", "Dec"];
  let nombre = prefijos[n] || `C${n}`;

  // Detectar tipo de enlace y posición
  let tieneDoble = enlaces.find(e => e.tipo === "doble");
  let tieneTriple = enlaces.find(e => e.tipo === "triple");

  if (tieneTriple) {
    // posición mínima del enlace triple
    let pos = Math.min(tieneTriple.c1+1, tieneTriple.c2+1);
    nombre += `-${pos}-ino`;
  } else if (tieneDoble) {
    // posición mínima del enlace doble
    let pos = Math.min(tieneDoble.c1+1, tieneDoble.c2+1);
    nombre += `-${pos}-eno`;
  } else {
    nombre += "ano";
  }

  // Mostrar resultado
  document.getElementById("nombre").innerText =
    `${nombre} | Fórmula: ${formula} | Enlaces C–C: ${enlaces.length}`;
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

