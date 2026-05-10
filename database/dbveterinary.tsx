import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('miveterinariaApp.db');

// Inicializar la base de datos
export const initDB = () => {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS mascotas (
      id INTEGER PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL,
      especie TEXT NOT NULL,
      edad INTEGER NOT NULL,
      peso REAL NOT NULL,
      dueno TEXT NOT NULL,
      correo TEXT NOT NULL,
      vacunas TEXT,
      alergias TEXT,
      condicion TEXT,
      observaciones TEXT,
      fecha TEXT,
      hora TEXT
    );
  `);
};

// Guardar registro con todos los campos
export const guardarRegistro = async (registro: {
  nombre: string;
  especie: string;
  edad: number;
  peso: number;
  dueno: string;
  correo: string;
  vacunas: string;
  alergias: string;
  condicion: string;
  observaciones: string;
  fecha: string;
  hora: string;
}) => {
  await db.runAsync(
    `INSERT INTO mascotas 
     (nombre, especie, edad, peso, dueno, correo, vacunas, alergias, condicion, observaciones, fecha, hora) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      registro.nombre,
      registro.especie,
      registro.edad,       // ✅ corregido: edad antes de peso
      registro.peso,
      registro.dueno,
      registro.correo,
      registro.vacunas,
      registro.alergias,
      registro.condicion,
      registro.observaciones,
      registro.fecha,
      registro.hora,
    ]
  );
};

// Obtener todos los registros
export const obtenerRegistros = async (): Promise<any[]> => {
  const result = await db.getAllAsync('SELECT * FROM mascotas;');
  return result;
};

// Obtener un registro por ID
export const obtenerRegistroPorId = async (id: number) => {
  const result = await db.getAllAsync('SELECT * FROM mascotas WHERE id=?;', [id]);
  return result[0]; // devuelve el primer registro encontrado
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
  peso: number;
  dueno: string;
  correo: string;
  vacunas: string;
  alergias: string;
  condicion: string;
  observaciones: string;
  fecha: string;
  hora: string;
}) => {
  await db.runAsync(
    `UPDATE mascotas 
     SET nombre=?, especie=?, edad=?, peso=?, dueno=?, correo=?, vacunas=?, alergias=?, condicion=?, observaciones=?, fecha=?, hora=? 
     WHERE id=?;`,
    [
      registro.nombre,
      registro.especie,
      registro.edad,
      registro.peso,
      registro.dueno,
      registro.correo,
      registro.vacunas,
      registro.alergias,
      registro.condicion,
      registro.observaciones,
      registro.fecha,
      registro.hora,
      registro.id,
    ]
  );
};
