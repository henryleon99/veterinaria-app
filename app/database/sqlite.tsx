import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('veterinaria.db');

export const initDB = () => {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS mascotas (
      id INTEGER PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL,
      especie TEXT NOT NULL,
      edad INTEGER NOT NULL,
      dueno TEXT NOT NULL,
      vacunas TEXT,
      alergias TEXT,
      condicion TEXT,
      observaciones TEXT,
      fecha TEXT
    );
  `);
};

// Guardar registro con todos los campos
export const guardarRegistro = async (registro: {
  nombre: string;
  especie: string;
  edad: number;
  dueno: string;
  vacunas?: string;
  alergias?: string;
  condicion?: string;
  observaciones?: string;
  fecha?: string;
}) => {
  await db.runAsync(
    `INSERT INTO mascotas 
     (nombre, especie, edad, dueno, vacunas, alergias, condicion, observaciones, fecha) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      registro.nombre,
      registro.especie,
      registro.edad,
      registro.dueno,
      registro.vacunas ??"",
      registro.alergias ??"",
      registro.condicion ??"",
      registro.observaciones ??"",
      registro.fecha ??"",
    ]
  );
};

// Obtener todos los registros
export const obtenerRegistros = async (p0: (registros: any) => void): Promise<any[]> => {
  const result = await db.getAllAsync('SELECT * FROM mascotas;');
  return result;
};

// Eliminar registro por ID
export const eliminarRegistro = async (id: number) => {
  await db.runAsync('DELETE FROM mascotas WHERE id=?;', [id]);
};

// Actualizar registro por ID
export const actualizarRegistro = async (registro: {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  dueno: string;
  vacunas: string;
  alergias: string;
  condicion: string;
  observaciones: string;
  fecha: string;
}) => {
  await db.runAsync(
    `UPDATE mascotas 
     SET nombre=?, especie=?, edad=?, dueno=?, vacunas=?, alergias=?, condicion=?, observaciones=?, fecha=? 
     WHERE id=?;`,
    [
      registro.nombre,
      registro.especie,
      registro.edad,
      registro.dueno,
      registro.vacunas,
      registro.alergias,
      registro.condicion,
      registro.observaciones,
      registro.fecha,
      registro.id,
    ]
  );
};