 import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Alert, Button, Modal, TouchableOpacity } from 'react-native';
import { obtenerRegistros, eliminarRegistro, actualizarRegistro, obtenerRegistroPorId } from '../../database/dbveterinary';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { generarPlantillaPDF } from "../../utils/pdfTemplate"; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; 
import SearchBar from '../../components/SearchBar';

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


  const cargarRegistros = async () => {
    const registros = await obtenerRegistros();
    setMascotas(registros);
  };

  useEffect(() => {
    cargarRegistros();
  }, []);

  const handleEliminar = async (id: number) => {
    await eliminarRegistro(id);
    cargarRegistros();
    Alert.alert("Registro eliminado", "La información de la mascota ha sido eliminada exitosamente.");
  };

  const handleEditar = (registro: any) => {
    setEditando(registro.id);
    setForm({ ...registro });
  };

  const handleActualizar = async () => {

    if(!form.nombre.trim() || !form.especie.trim() || !form.edad || !form.peso || !form.dueno.trim() || !form.correo.trim() || !form.condicion.trim() || !form.fecha.trim() || !form.hora.trim()) {
      Alert.alert("Campos incompletos", "Por favor, completa todos los campos obligatorios.");
      return;
    }

  const numEdad = parseInt(form.edad, 10);
    if (isNaN(numEdad) || numEdad < 0 || numEdad > 30) {
      Alert.alert("Edad inválida", "Por favor, ingresa una edad válida (0-30).");
      return;
    }

  const numPeso = parseFloat(form.peso);
    if (isNaN(numPeso) || numPeso < 0 || numPeso > 200) {
      Alert.alert("Peso inválido", "Por favor, ingresa un peso válido (0-200 kg).");
      return;
    }
    await actualizarRegistro({ ...form, edad: numEdad, peso: numPeso });
    Alert.alert("Registro actualizado", "La información de la mascota ha sido actualizada exitosamente.");
    setEditando(null);
    cargarRegistros();
  };

  const generarPDF = async (registro: any) => {
    const html = generarPlantillaPDF(registro);
    const { uri } = await Print.printToFileAsync({ html });
    console.log("PDF generado en:", uri);
    await Sharing.shareAsync(uri);
  };

  const handleBuscarPorId = async () => {
    if (!BusquedaId.trim()) return;
    const registro = await obtenerRegistroPorId(Number(BusquedaId));
    if (registro) {
      setResultado(registro);
    } else {
      Alert.alert("No encontrado", "No se encontró ningún registro con ese ID.");
      setResultado(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Mascotas</Text>

      <View><SearchBar busquedaId={BusquedaId} setBusquedaId={setBusquedaId} onBuscar={handleBuscarPorId} /></View>
      {resultado && (
        <View style={styles.card}>
          <Text><Text style={styles.label}>ID: </Text>{resultado.id}</Text>
          <Text><Text style={styles.label}>Nombre: </Text>{resultado.nombre}</Text>
        </View>
      )}



      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {editando === item.id ? (
              <>

                {/* ID (solo lectura) */}
                <View style={styles.row}>
                  <Text style={styles.label}>ID:</Text>
                  <TextInput style={styles.inputFlex} value={String(form.id)} editable={false} />
                </View>


                {/* Nombre */}
                <View style={styles.row}>
                  <Text style={styles.label}>Nombre:</Text>
                  <TextInput style={styles.inputFlex} value={form.nombre} onChangeText={(t) => setForm({ ...form, nombre: t })} />
                </View>

                
                {/* Especie */}
                <View style={styles.row}>
                  <Text style={styles.label}>Especie:</Text>
                  <TouchableOpacity style={styles.inputFlex} onPress={() => setModalVisible(true)}>
                    <Text>{form.especie || "Selecciona especie..."}</Text>
                  </TouchableOpacity>
                </View>

                <Modal visible={modalVisible} transparent={true} animationType="slide">
                 <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    {especies.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={styles.option}
                        onPress={() => {
                          setForm({ ...form, especie: item });
                          setModalVisible(false);
                        }}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    ))}
                    <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                  </View>
                </View>
              </Modal>

                {/* Edad */}
                <View style={styles.row}>
                  <Text style={styles.label}>Edad:</Text>
                  <TextInput style={styles.inputFlex} value={String(form.edad)} keyboardType="numeric" onChangeText={(t) => setForm({ ...form, edad: Number(t) })} />
                </View>

                {/* Peso */}
                <View style={styles.row}>
                  <Text style={styles.label}>Peso (kg):</Text>
                  <TextInput style={styles.inputFlex} value={String(form.peso)} keyboardType="decimal-pad" onChangeText={(t) => setForm({ ...form, peso: t })} />
                </View>

                {/* Dueño */}
                <View style={styles.row}>
                  <Text style={styles.label}>Dueño:</Text>
                  <TextInput style={styles.inputFlex} value={form.dueno} onChangeText={(t) => setForm({ ...form, dueno: t })} />
                </View>

                {/* Correo */}
                <View style={styles.row}>
                  <Text style={styles.label}>Correo del dueño:</Text>
                  <TextInput style={styles.inputFlex} value={form.correo} onChangeText={(t) => setForm({ ...form, correo: t })} keyboardType="email-address" />
                </View>

                {/* Vacunas */}
                <View style={styles.row}>
                  <Text style={styles.label}>Tipo de vacunas:</Text>
                  <TextInput style={styles.inputFlex} value={form.vacunas} onChangeText={(t) => setForm({ ...form, vacunas: t })} />
                </View>

                {/* Alergias */}
                <View style={styles.row}>
                  <Text style={styles.label}>Alergias:</Text>
                  <TextInput style={styles.inputFlex} value={form.alergias} onChangeText={(t) => setForm({ ...form, alergias: t })} />
                </View>

                {/* Condición */}
                <View style={styles.row}>
                  <Text style={styles.label}>Condición:</Text>
                  <TextInput style={styles.inputFlex} value={form.condicion} onChangeText={(t) => setForm({ ...form, condicion: t })} />
                </View>

                {/* Observaciones */}
                <View style={styles.row}>
                  <Text style={styles.label}>Observaciones:</Text>
                  <TextInput style={styles.inputFlex} value={form.observaciones} onChangeText={(t) => setForm({ ...form, observaciones: t })} />
                </View>

                {/* Fecha con ícono */}
                <View style={styles.row}>
                  <Text style={styles.label}>Fecha:</Text>
                  <TextInput style={styles.inputFlex} value={form.fecha} editable={false} />
                  <Ionicons name="calendar" size={28} color="gray" style={styles.icon} onPress={() => setMostrarPicker(true)} />
                </View>
                {mostrarPicker && (
                  <DateTimePicker
                    value={form.fecha ? new Date(form.fecha) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                      setMostrarPicker(false);
                      if (selectedDate) {
                        setForm({ ...form, fecha: selectedDate.toISOString().split('T')[0] });
                      }
                    }}
                  />
                )}

                {/* Hora con ícono */}
                <View style={styles.row}>
                  <Text style={styles.label}>Hora:</Text>
                  <TextInput style={styles.inputFlex} value={form.hora} editable={false} />
                  <Ionicons name="time" size={28} color="gray" style={styles.icon} onPress={() => setMostrarPickerHora(true)} />
                </View>
                {mostrarPickerHora && (
                  <DateTimePicker
                    value={form.hora ? new Date(form.hora) : new Date()}
                    mode="time"
                    display="default"
                    onChange={(_, selectedTime) => {
                      setMostrarPickerHora(false);
                      if (selectedTime) {
                        setForm({ ...form, hora: selectedTime.toISOString().split('T')[1].slice(0, 5) });
                      }
                    }}
                  />
                )}

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
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { fontWeight: 'bold', marginRight: 8, width: 100 }, 
  inputFlex: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5 },
  icon: { marginLeft: 10 },

  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.3)',
},
modalContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  width: '80%',
},
option: {
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},

});