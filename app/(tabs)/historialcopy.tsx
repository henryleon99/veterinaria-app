import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { generarPlantillaPDF } from "../../utils/pdfTemplate";
import SearchBar from '../../components/SearchBar';
import PetRegistration from '../../components/PetRegistration';
import { 
  editarRegistro, 
  borrarRegistro, 
  listarRegistros, 
  buscarRegistroPorId 
} from '../../components/ResgistroService';

// 1. Interfaz estricta para que TypeScript no genere errores de "id" no existe
interface Mascota {
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
}

export default function HistorialScreen() {
  // --- ESTADOS ---
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [editando, setEditando] = useState<number | null>(null);
  const [form, setForm] = useState<Mascota>({} as Mascota);
  const [resultado, setResultado] = useState<Mascota | null>(null);
  const [BusquedaId, setBusquedaId] = useState('');
  
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [mostrarPickerHora, setMostrarPickerHora] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const especies = ["Perro", "Gato", "Conejo", "Tortuga", "Hámster"];
  const flatListRef = useRef<FlatList<Mascota>>(null);

  // --- LÓGICA DE CARGA ---
  const cargarRegistros = async () => {
    try {
      const datos = await listarRegistros();
      setMascotas(datos || []);
    } catch (error) {
      console.error("Error cargando registros:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarRegistros();
    }, [])
  );

  // --- MANEJADORES DE EVENTOS ---
  const handleEliminar = async (id: number) => {
    await borrarRegistro(id);
    cargarRegistros();
  };

  const handleEditar = (registro: Mascota) => {
    setEditando(registro.id);
    setForm({ ...registro });
  };

  const handleActualizar = async () => {
    if (!form) return;
    await editarRegistro(form);
    setEditando(null);
    cargarRegistros();
    Alert.alert("Éxito", "Registro actualizado correctamente.");
  };

  const generarPDF = async (registro: Mascota) => {
    const html = generarPlantillaPDF(registro);
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  // --- FUNCIÓN DE BÚSQUEDA CORREGIDA ---
  const handleBuscarPorId = async () => {
    if (!BusquedaId.trim()) {
      setResultado(null);
      cargarRegistros();
      return;
    }

    try {
      const idNumerico = Number(BusquedaId);
      if (isNaN(idNumerico)) {
        Alert.alert("Error", "El ID debe ser un número.");
        return;
      }

      const registroEncontrado = await buscarRegistroPorId(idNumerico) as Mascota | null;

      if (registroEncontrado && registroEncontrado.id) {
        setMascotas([registroEncontrado]); // Filtra la lista visual
        setResultado(registroEncontrado);  // Llena el estado de resultado
      } else {
        Alert.alert("No encontrado", "No existe una mascota con ese ID.");
        setResultado(null);
        cargarRegistros();
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al buscar en la base de datos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Mascotas</Text>

      <SearchBar 
        busquedaId={BusquedaId} 
        setBusquedaId={setBusquedaId} 
        onBuscar={handleBuscarPorId} 
      />

      {/* Si hay un resultado de búsqueda, lo mostramos arriba */}
      {resultado && (
        <View style={styles.resultadoCaja}>
          <Text style={styles.label}>Viendo resultado del ID: {resultado.id}</Text>
          <Button title="Limpiar Búsqueda" onPress={() => { setResultado(null); cargarRegistros(); }} color="#666" />
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={mascotas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {editando === item.id ? (
              <View>
                <PetRegistration
                  nombre={form.nombre} setNombre={(text) => setForm({ ...form, nombre: text })}
                  especie={form.especie} setEspecie={(text) => setForm({ ...form, especie: text })}
                  edad={form.edad.toString()} setEdad={(text) => setForm({ ...form, edad: Number(text) || 0 })}
                  peso={form.peso.toString()} setPeso={(text) => setForm({ ...form, peso: Number(text) || 0 })}
                  dueno={form.dueno} setDueno={(text) => setForm({ ...form, dueno: text })}
                  correo={form.correo} setCorreo={(text) => setForm({ ...form, correo: text })}
                  vacunas={form.vacunas} setVacunas={(text) => setForm({ ...form, vacunas: text })}
                  alergias={form.alergias} setAlergias={(text) => setForm({ ...form, alergias: text })}
                  condicion={form.condicion} setCondicion={(text) => setForm({ ...form, condicion: text })}
                  observaciones={form.observaciones} setObservaciones={(text) => setForm({ ...form, observaciones: text })}
                  fecha={form.fecha} setFecha={(text) => setForm({ ...form, fecha: text })}
                  hora={form.hora} setHora={(text) => setForm({ ...form, hora: text })}
                  mostrarPicker={mostrarPicker} setMostrarPicker={setMostrarPicker}
                  mostrarPickerHora={mostrarPickerHora} setMostrarPickerHora={setMostrarPickerHora}
                  modalVisible={modalVisible} setModalVisible={setModalVisible}
                  especies={especies}
                />
                <View style={styles.filaBotones}>
                  <Button title="Guardar" onPress={handleActualizar} color="green" />
                  <Button title="Cancelar" onPress={() => setEditando(null)} color="red" />
                </View>
              </View>
            ) : (
              <View>
                <Text><Text style={styles.bold}>ID:</Text> {item.id}</Text>
                <Text><Text style={styles.bold}>Nombre:</Text> {item.nombre}</Text>
                <Text><Text style={styles.bold}>Dueño:</Text> {item.dueno}</Text>
                <Text><Text style={styles.bold}>Fecha:</Text> {item.fecha}</Text>
                
                <View style={styles.filaBotones}>
                  <Button title="Editar" onPress={() => handleEditar(item)} />
                  <Button title="PDF" onPress={() => generarPDF(item)} color="orange" />
                  <Button title="Borrar" onPress={() => handleEliminar(item.id)} color="red" />
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', marginTop: 30 },
  card: { 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#eee', 
    marginBottom: 12, 
    borderRadius: 8,
    backgroundColor: '#fafafa',
    elevation: 2
  },
  bold: { fontWeight: 'bold' },
  label: { marginBottom: 5, color: '#444' },
  resultadoCaja: { padding: 10, backgroundColor: '#e8f4fd', marginBottom: 10, borderRadius: 5 },
  filaBotones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});