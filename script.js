let contador = 0;
let carbonos = [];
let enlaces = [];
let ramificaciones = [];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function agregarCarbono() {
  const div = document.createElement("div");
  div.className = "carbono";
  div.innerText = "C";
  div.style.left = (50 + contador*60) + "px";
  div.style.top = "100px";
  div.style.position = "absolute";
  div.dataset.id = contador;
  div.dataset.enlaces = 0;

  canvas.appendChild(div);
  carbonos.push(div);
  contador++;
  actualizarNombre();
  actualizarBotonesRamificacion();
}

function crearEnlace(c1, c2, tipo="simple") {
  enlaces.push({c1, c2, tipo});
  carbonos[c1].dataset.enlaces++;
  carbonos[c2].dataset.enlaces++;
  actualizarNombre();
  dibujarEnlaces();
}

function agregarRamificacion(tipo, carbonoBase) {
  ramificaciones.push({tipo, carbonoBase});
  actualizarNombre();
  dibujarEnlaces();
}

function calcularHidrogenos() {
  let totalH = 0;
  carbonos.forEach(c => {
    let enlacesC = parseInt(c.dataset.enlaces);
    let hidrogenos = 4 - enlacesC;
    totalH += hidrogenos;
  });

  // Ajustar por ramificaciones
  ramificaciones.forEach(r => {
    if (r.tipo === "metil") totalH += 3;
    if (r.tipo === "etil") totalH += 5;
  });

  return totalH;
}

function dibujarEnlaces() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar enlaces C–C
  enlaces.forEach(e => {
    const c1 = carbonos[e.c1];
    const c2 = carbonos[e.c2];
    const x1 = parseInt(c1.style.left) + 25;
    const y1 = parseInt(c1.style.top) + 25;
    const x2 = parseInt(c2.style.left) + 25;
    const y2 = parseInt(c2.style.top) + 25;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = (e.tipo === "simple" ? 2 : e.tipo === "doble" ? 4 : 6);
    ctx.stroke();
  });

  // Dibujar ramificaciones
  ramificaciones.forEach(r => {
    const base = carbonos[r.carbonoBase];
    const x = parseInt(base.style.left) + 25;
    const y = parseInt(base.style.top) + 25;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 50, y - 30);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.fillText(r.tipo === "metil" ? "CH3" : "CH2-CH3", x + 55, y - 30);
  });
}

function actualizarNombre() {
  let n = carbonos.length;
  if (n === 0) {
    document.getElementById("nombre").innerText = "---";
    return;
  }

  let totalH = calcularHidrogenos();
  let formula = `C${n + ramificaciones.length}H${totalH}`;

  const prefijos = ["", "Met", "Et", "Prop", "But", "Pent", "Hex", "Hept", "Oct", "Non", "Dec"];
  let nombre = prefijos[n] || `C${n}`;

  let tieneDoble = enlaces.find(e => e.tipo === "doble");
  let tieneTriple = enlaces.find(e => e.tipo === "triple");

  if (tieneTriple) {
    let pos = Math.min(tieneTriple.c1+1, tieneTriple.c2+1);
    nombre += `-${pos}-ino`;
  } else if (tieneDoble) {
    let pos = Math.min(tieneDoble.c1+1, tieneDoble.c2+1);
    nombre += `-${pos}-eno`;
  } else {
    nombre += "ano";
  }

  // Agregar ramificaciones al nombre
  ramificaciones.forEach(r => {
    let pos = r.carbonoBase + 1;
    nombre = `${pos}-${r.tipo}${nombre}`;
  });

  document.getElementById("nombre").innerText =
    `${nombre} | Fórmula: ${formula}`;
}

function actualizarBotonesRamificacion() {
  const contenedor = document.getElementById("botones-ramificacion");
  contenedor.innerHTML = ""; // limpiar botones anteriores

  carbonos.forEach((c, i) => {
    const botonMetil = document.createElement("button");
    botonMetil.innerText = `Agregar metil en C${i+1}`;
    botonMetil.onclick = () => agregarRamificacion("metil", i);

    const botonEtil = document.createElement("button");
    botonEtil.innerText = `Agregar etil en C${i+1}`;
    botonEtil.onclick = () => agregarRamificacion("etil", i);

    contenedor.appendChild(botonMetil);
    contenedor.appendChild(botonEtil);
  });
}

function reiniciar() {
  carbonos = [];
  enlaces = [];
  ramificaciones = [];
  contador = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("canvas").innerHTML = "";
  document.getElementById("nombre").innerText = "---";
  document.getElementById("botones-ramificacion").innerHTML = "";
}
