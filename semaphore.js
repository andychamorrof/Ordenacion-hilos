class Semaphore {
  constructor(numRangos) {
    this.rangos = new Array(numRangos).fill(false);
  }

  // wait() — busca y reserva el PRIMER rango libre
  // retorna -1 si NO HAY más rangos libres (hilo debe terminar)
  tomarRango() {
    for (let i = 0; i < this.rangos.length; i++) {
      if (!this.rangos[i]) {
        this.rangos[i] = true; // marcar como tomado
        return i;
      }
    }
    return -1; // no hay rangos libres → hilo termina
  }

  // Consulta cuántos rangos libres quedan
  libresRestantes() {
    return this.rangos.filter(v => !v).length;
  }

  getEstado() {
    return this.rangos.map((tomado, i) => ({
      rango: i,
      estado: tomado ? 'tomado' : 'libre'
    }));
  }
}
