// registroService.ts
import { guardarRegistro, actualizarRegistro, eliminarRegistro, obtenerRegistros, obtenerRegistroPorId } 
from '../database/dbveterinary';

import { Alert } from 'react-native';


// Validaciones
export const validarEdad = (edad: string): number | null => {
  const numEdad = parseInt(edad, 10);
  if (isNaN(numEdad) || numEdad.toString() !== edad || numEdad < 0 || numEdad > 30) {
    Alert.alert("Edad inválida", "Por favor, ingresa solo números enteros entre 0 y 30.");
    return null;
  }
  return numEdad;
};

export const validarPeso = (peso: string): number | null => {
  const numPeso = parseFloat(peso);
  if (isNaN(numPeso) || numPeso < 0 || numPeso > 200) {
    Alert.alert("Peso inválido", "Por favor, ingresa un peso válido (0-200 kg).");
    return null;
  }
  return numPeso;
};

// Guardar nuevo registro
export const crearRegistro = async (form: any) => {
  const numEdad = validarEdad(form.edad);
  const numPeso = validarPeso(form.peso);

  if (numEdad === null || numPeso === null) return;

  await guardarRegistro({ ...form, edad: numEdad, peso: numPeso });
  Alert.alert("Registro guardado", "La información de la mascota ha sido guardada exitosamente.");
};

// Actualizar registro existente
export const editarRegistro = async (form: any) => {
  const numEdad = validarEdad(form.edad);
  const numPeso = validarPeso(form.peso);

  if (numEdad === null || numPeso === null) return;

  await actualizarRegistro({ ...form, edad: numEdad, peso: numPeso });
  Alert.alert("Registro actualizado", "La información de la mascota ha sido actualizada exitosamente.");
};

// Eliminar registro
export const borrarRegistro = async (id: number) => {
  await eliminarRegistro(id);
  Alert.alert("Registro eliminado", "La información de la mascota ha sido eliminada exitosamente.");
};

// Obtener todos los registros
export const listarRegistros = async () => {
  return await obtenerRegistros();
};

// Buscar por ID
export const buscarRegistroPorId = async (id: number) => {
  return await obtenerRegistroPorId(id);
};
