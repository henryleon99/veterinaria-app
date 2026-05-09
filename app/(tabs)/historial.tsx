import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native';
import { obtenerRegistros, eliminarRegistro, actualizarRegistro } from '../database/sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { generarPlantillaPDF } from "../../utils/pdfTemplate"; // ✅ ya lo tienes separado

export default function HistorialScreen() {
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [editando, setEditando] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const cargarRegistros = () => {
    obtenerRegistros((registros) => {
      setMascotas(registros);
    });
  };

  useEffect(() => {
    cargarRegistros();
  }, []);

  const handleEliminar = (id: number) => {
    eliminarRegistro(id);
    cargarRegistros();
  };

  const handleEditar = (registro: any) => {
    setEditando(registro.id);
    setForm({ ...registro });
  };

  const handleActualizar = () => {
    actualizarRegistro(form);
    setEditando(null);
    cargarRegistros();
  };

  const generarPDF = async (registro: any) => {
    const html = generarPlantillaPDF(registro);
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Mascotas</Text>

      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No hay mascotas registradas</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {editando === item.id ? (
              <>
                <TextInput style={styles.input} value={form.nombre} onChangeText={(t) => setForm({ ...form, nombre: t })} />
                <TextInput style={styles.input} value={form.especie} onChangeText={(t) => setForm({ ...form, especie: t })} />
                <TextInput style={styles.input} value={String(form.edad)} onChangeText={(t) => setForm({ ...form, edad: Number(t) })} keyboardType="numeric" />
                <TextInput style={styles.input} value={form.dueno} onChangeText={(t) => setForm({ ...form, dueno: t })} />
                <TextInput style={styles.input} value={form.vacunas} onChangeText={(t) => setForm({ ...form, vacunas: t })} />
                <TextInput style={styles.input} value={form.alergias} onChangeText={(t) => setForm({ ...form, alergias: t })} />
                <TextInput style={styles.input} value={form.condicion} onChangeText={(t) => setForm({ ...form, condicion: t })} />
                <TextInput style={styles.input} value={form.observaciones} onChangeText={(t) => setForm({ ...form, observaciones: t })} />

                <Button title="Seleccionar fecha" onPress={() => setMostrarPicker(true)} />
                <TextInput style={styles.input} value={form.fecha} editable={false} />

                {mostrarPicker && (
                  <DateTimePicker
                    value={form.fecha ? new Date(form.fecha) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setMostrarPicker(false);
                      if (selectedDate) {
                        setForm({ ...form, fecha: selectedDate.toISOString().split('T')[0] });
                      }
                    }}
                  />
                )}

                <Button title="Guardar cambios" onPress={handleActualizar} />
                <Button title="Cancelar" onPress={() => setEditando(null)} />
              </>
            ) : (
              <>
                <Text>{item.nombre} ({item.especie})</Text>
                <Text>Edad: {item.edad}</Text>
                <Text>Dueño: {item.dueno}</Text>
                <Text>Vacunas: {item.vacunas}</Text>
                <Text>Alergias: {item.alergias}</Text>
                <Text>Condición: {item.condicion}</Text>
                <Text>Observaciones: {item.observaciones}</Text>
                <Text>Fecha: {item.fecha}</Text>
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
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 5, borderRadius: 5 },
});
