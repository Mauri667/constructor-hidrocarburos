let contador = 0;
let carbonos = [];
let enlaces = [];
let ramificaciones = [];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function agregarCarbono() {
  if (carbonos.length >= 10) {
    alert("Ya alcanzaste el máximo de 10 carbonos.");
    return;
  }

  // Guardamos coordenadas del nuevo carbono
  let x = 100 + contador * 60;
  let y = 200;
  carbonos.push({x, y, enlaces: 0});
  contador++;
  actualizarNombre();
  actualizarBotonesRamificacion();
  dibujarEnlaces();
}

function crearEnlace(c1, c2, tipo="simple") {
  enlaces.push({c1, c2, tipo});
  carbonos[c1].enlaces++;
  carbonos[c2].enlaces++;
  actualizarNombre();
  dibujarEnlaces();
}

function agregarRamificacion(tipo, carbonoBase) {
  // Eliminar ramificación previa en ese carbono si existe
  ramificaciones = ramificaciones.filter(r => r.carbonoBase !== carbonoBase);

  // Agregar la nueva ramificación
  ramificaciones.push({tipo, carbonoBase});
  actualizarNombre();
  dibujarEnlaces();
}

function calcularHidrogenos() {
  let totalH = 0;
  carbonos.forEach(c => {
    let hidrogenos = 4 - c.enlaces;
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
    ctx.beginPath();
    ctx.moveTo(c1.x, c1.y);
    ctx.lineTo(c2.x, c2.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = (e.tipo === "simple" ? 2 : e.tipo === "doble" ? 4 : 6);
    ctx.stroke();
  });

  // Dibujar carbonos como círculos azules
  carbonos.forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    ctx.strokeStyle = "#2c3e50";
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Segoe UI";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("C" + (i+1), c.x, c.y);
  });

  // Dibujar ramificaciones
  ramificaciones.forEach(r => {
    const base = carbonos[r.carbonoBase];
    ctx.beginPath();
    ctx.moveTo(base.x, base.y);
    ctx.lineTo(base.x + 50, base.y - 30);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.fillStyle = "green";
    ctx.font = "bold 14px Segoe UI";
    ctx.fillText(r.tipo === "metil" ? "CH3" : "CH2-CH3", base.x + 55, base.y - 30);
  });
}

function actualizarNombre() {
  let n = carbonos.length;
  if (n === 0) {
    document.getElementById("nombre").innerText = "---";
    document.getElementById("contador").innerText = "Carbonos: 0 | Hidrógenos: 0";
    return;
  }

  let totalH = calcularHidrogenos();
  let formula = `C${n + ramificaciones.length}H${totalH}`;

  const prefijos = [
    "", "Met", "Et", "Prop", "But", "Pent",
    "Hex", "Hept", "Oct", "Non", "Dec"
  ];
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

  document.getElementById("contador").innerText =
    `Carbonos: ${n + ramificaciones.length} | Hidrógenos: ${totalH}`;
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
  document.getElementById("nombre").innerText = "---";
  document.getElementById("contador").innerText = "Carbonos: 0 | Hidrógenos: 0";
  document.getElementById("botones-ramificacion").innerHTML = "";
}

