// El worker ordena un rango por burbuja y devuelve el resultado

self.onmessage = function(e) {
  const { arr, inicio, fin, idHilo, rango } = e.data;

  for (let i = inicio; i < fin; i++) {
    for (let j = inicio; j < fin - (i - inicio) - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  self.postMessage({ arr, idHilo, rango, inicio, fin });
};
