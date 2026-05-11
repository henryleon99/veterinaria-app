import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { generarPlantillaPDF } from "../../utils/pdfTemplate"; 
import SearchBar from '../../components/SearchBar';
import PetRegistration from '../../components/PetRegistration';
import { editarRegistro, borrarRegistro, listarRegistros, buscarRegistroPorId } from '../../components/ResgistroService';

export default function HistorialScreen() {
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [editando, setEditando] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [mostrarPickerHora, setMostrarPickerHora] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const especies = ["Perro", "Gato", "Conejo", "Tortuga", "Hámster"];

  const [resultado, setResultado] = useState<any>(null);
  const [BusquedaId, setBusquedaId] = useState('');

  const flatListRef = useRef<FlatList<any>>(null);

  const cargarRegistros = async () => {
    const registros = await listarRegistros();
    setMascotas(registros);
  };

  useEffect(() => {
    cargarRegistros();
  }, []);

  const handleEliminar = async (id: number) => {
    await borrarRegistro(id);
    cargarRegistros();
  };

  const handleEditar = (registro: any) => {
    setEditando(registro.id);
    setForm({ ...registro });
  };

  const handleActualizar = async () => {
    await editarRegistro(form);
    setEditando(null);
    cargarRegistros();
  };

  const generarPDF = async (registro: any) => {
    const html = generarPlantillaPDF(registro);
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const handleBuscarPorId = async () => {
    if (!BusquedaId.trim()) return;
    const registro = await buscarRegistroPorId(Number(BusquedaId));
    if (registro) {
      setResultado(registro);
    } else {
      Alert.alert("No encontrado", "No se encontró ningún registro con ese ID.");
      setResultado(null);

      const index = mascotas.findIndex((m) => m.id === Number(BusquedaId));
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    } 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Mascotas</Text>

      <SearchBar busquedaId={BusquedaId} setBusquedaId={setBusquedaId} onBuscar={handleBuscarPorId} />
      {resultado && (
        <View style={styles.card}>
          <Text><Text style={styles.label}>ID: </Text>{resultado.id}</Text>
          <Text><Text style={styles.label}>Nombre: </Text>{resultado.nombre}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={mascotas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {editando === item.id ? (
              <>
                <PetRegistration
                  nombre={form.nombre} setNombre={(text) => setForm((prev: any) => ({ ...prev, nombre: text }))}
                  especie={form.especie} setEspecie={(text) => setForm((prev: any) => ({ ...prev, especie: text }))}
                  edad={form.edad} setEdad={(text) => setForm((prev: any) => ({ ...prev, edad: text }))}
                  peso={form.peso} setPeso={(text) => setForm((prev: any) => ({ ...prev, peso: text }))}
                  dueno={form.dueno} setDueno={(text) => setForm((prev: any) => ({ ...prev, dueno: text }))}
                  correo={form.correo} setCorreo={(text) => setForm((prev: any) => ({ ...prev, correo: text }))}
                  vacunas={form.vacunas} setVacunas={(text) => setForm((prev: any) => ({ ...prev, vacunas: text }))}
                  alergias={form.alergias} setAlergias={(text) => setForm((prev: any) => ({ ...prev, alergias: text }))}
                  condicion={form.condicion} setCondicion={(text) => setForm((prev: any) => ({ ...prev, condicion: text }))}
                  observaciones={form.observaciones} setObservaciones={(text) => setForm((prev: any) => ({ ...prev, observaciones: text }))}
                  fecha={form.fecha} setFecha={(text) => setForm((prev: any) => ({ ...prev, fecha: text }))}
                  hora={form.hora} setHora={(text) => setForm((prev: any) => ({ ...prev, hora: text }))}
                  mostrarPicker={mostrarPicker} setMostrarPicker={setMostrarPicker}
                  mostrarPickerHora={mostrarPickerHora} setMostrarPickerHora={setMostrarPickerHora}
                  modalVisible={modalVisible} setModalVisible={setModalVisible}
                  especies={especies}
                />

                <Button title="Guardar cambios" onPress={handleActualizar} />
                <Button title="Cancelar" onPress={() => setEditando(null)} />
              </>
            ) : (
              <>
                <Text><Text style={styles.label}>ID: </Text>{item.id}</Text>
                <Text><Text style={styles.label}>Nombre: </Text>{item.nombre}</Text>
                <Text><Text style={styles.label}>Especie: </Text>{item.especie}</Text>
                <Text><Text style={styles.label}>Edad: </Text>{item.edad}</Text>
                <Text><Text style={styles.label}>Peso: </Text>{item.peso} kg</Text>
                <Text><Text style={styles.label}>Dueño: </Text>{item.dueno}</Text>
                <Text><Text style={styles.label}>Correo del dueño: </Text>{item.correo}</Text>
                <Text><Text style={styles.label}>Vacunas: </Text>{item.vacunas}</Text>
                <Text><Text style={styles.label}>Alergias: </Text>{item.alergias}</Text>
                <Text><Text style={styles.label}>Condición: </Text>{item.condicion}</Text>
                <Text><Text style={styles.label}>Observaciones: </Text>{item.observaciones}</Text>
                <Text><Text style={styles.label}>Fecha: </Text>{item.fecha}</Text>
                <Text><Text style={styles.label}>Hora: </Text>{item.hora}</Text>
                <Button title="Editar" onPress={() => handleEditar(item)} />
                <Button title="Eliminar" onPress={() => handleEliminar(item.id)} />
                <Button title="Generar PDF" onPress={() => generarPDF(item)} /> 
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', marginTop: 20 },
  card: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 5 },
  label: { fontWeight: 'bold', marginRight: 8, width: 100 }, 
});
