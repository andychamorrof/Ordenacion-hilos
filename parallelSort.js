const MAX = 1000;
const NUM_HILOS = 4;
const RANGO_SIZE = 100;
const NUM_RANGOS = 10;

function llenarArreglo() {
  const arreglo = Array.from({ length: MAX }, (_, indice) => indice); // 0..999

  for (let indice = arreglo.length - 1; indice > 0; indice--) {
    const indiceAleatorio = Math.floor(Math.random() * (indice + 1));

    [arreglo[indice], arreglo[indiceAleatorio]] =
      [arreglo[indiceAleatorio], arreglo[indice]];
  }

  return arreglo;
}

function burbujaRango(arreglo, inicio, fin) {
  for (let indiceExterior = inicio; indiceExterior < fin; indiceExterior++)
    for (
      let indiceInterior = inicio;
      indiceInterior < fin - (indiceExterior - inicio) - 1;
      indiceInterior++
    )
      if (arreglo[indiceInterior] > arreglo[indiceInterior + 1])
        [arreglo[indiceInterior], arreglo[indiceInterior + 1]] =
          [arreglo[indiceInterior + 1], arreglo[indiceInterior]];
}

function burbujaFinal(arreglo) {
  for (let indiceExterior = 0; indiceExterior < arreglo.length; indiceExterior++)
    for (
      let indiceInterior = 0;
      indiceInterior < arreglo.length - indiceExterior - 1;
      indiceInterior++
    )
      if (arreglo[indiceInterior] > arreglo[indiceInterior + 1])
        [arreglo[indiceInterior], arreglo[indiceInterior + 1]] =
          [arreglo[indiceInterior + 1], arreglo[indiceInterior]];
}

// ── FUNCIÓN PRINCIPAL ──
async function parallelSort(onProgress) {
  const arreglo = llenarArreglo();
  const semaforos = new Semaphore(NUM_RANGOS);

  async function trabajoHilo(idHilo) {
    while (true) {

      // Intenta tomar el siguiente rango libre del semáforo
      const numeroRango = semaforos.tomarRango();

      if (numeroRango === -1) {
        // No hay rangos libres → este hilo termina
        onProgress?.({ tipo: 'hiloTermina', idHilo });
        break;
      }

      // Hilo tomó el rango: ordenarlo
      onProgress?.({ tipo: 'rangoInicio', rango: numeroRango, idHilo });

      const inicio = numeroRango * RANGO_SIZE;
      const fin = inicio + RANGO_SIZE;

      await delay(20);
      burbujaRango(arreglo, inicio, fin);

      onProgress?.({ tipo: 'rangoFin', rango: numeroRango, idHilo });

      //   Al terminar, el while vuelve a buscar el siguiente
      //   rango libre automáticamente — sin esperar a nadie
    }
  }

  // Lanzar 4 hilos en paralelo — cada uno corre independiente
  const hilos = Array.from(
    { length: NUM_HILOS },
    (_, indiceHilo) => trabajoHilo(indiceHilo)
  );

  await Promise.all(hilos);

  // Proceso principal: burbuja final sobre todo el arreglo
  onProgress?.({ tipo: 'burbujaFinal' });

  await delay(30);
  burbujaFinal(arreglo);

  onProgress?.({ tipo: 'completado' });

  return arreglo;
}

const delay = milisegundos =>
  new Promise(resolve => setTimeout(resolve, milisegundos));
