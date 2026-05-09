import React, { useEffect, useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView, Alert, View } from 'react-native';
import { initDB, guardarRegistro } from '../../database/veterinarydb';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // 👈 importamos íconos

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState('');
  const [dueno, setDueno] = useState('');
  const [vacunas, setVacunas] = useState('');
  const [alergias, setAlergias] = useState('');
  const [condicion, setCondicion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fecha, setFecha] = useState('');
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [hora, setHora] = useState('');
  const [mostrarPickerHora, setMostrarPickerHora] = useState(false);

  useEffect(() => {
    initDB();
  }, []);

  const handleGuardar = () => {
    if (!nombre.trim() || !especie.trim() || !edad.trim() || !dueno.trim() || !condicion.trim() || !fecha.trim() || !hora.trim()) {
      Alert.alert("Campos incompletos", "Por favor, completa todos los campos obligatorios.");
      return;
    }

    guardarRegistro({
      nombre,
      especie,
      edad: Number(edad),
      dueno,
      vacunas,
      alergias,
      condicion,
      observaciones,
      fecha,
      hora,
    });

    setNombre('');
    setEspecie('');
    setEdad('');
    setDueno('');
    setVacunas('');
    setAlergias('');
    setCondicion('');
    setObservaciones('');
    setFecha('');
    setHora('');
    Alert.alert("Registro guardado", "La información de la mascota ha sido guardada exitosamente.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Registro de Mascota</Text>

      <TextInput style={styles.input} placeholder="Nombre del animal" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Especie (perro, gato, conejo...)" value={especie} onChangeText={setEspecie} />
      <TextInput style={styles.input} placeholder="Edad aproximada" value={String(edad)} keyboardType="numeric" onChangeText={setEdad} />
      <TextInput style={styles.input} placeholder="Nombre del dueño" value={dueno} onChangeText={setDueno} />

      <TextInput style={styles.input} placeholder="Vacunas aplicadas" value={vacunas} onChangeText={setVacunas} />
      <TextInput style={styles.input} placeholder="Alergias conocidas" value={alergias} onChangeText={setAlergias} />

      <TextInput style={styles.input} placeholder="Condición actual" value={condicion} onChangeText={setCondicion} />
      <TextInput style={styles.input} placeholder="Observaciones" value={observaciones} onChangeText={setObservaciones} />

      {/* Campo de fecha con ícono */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Fecha de ingreso" value={fecha} editable={false} />
        <Ionicons name="calendar" size={28} color="gray" onPress={() => setMostrarPicker(true)} style={{ marginLeft: 20 }} />
      </View>
      {mostrarPicker && (
        <DateTimePicker
          value={fecha ? new Date(fecha) : new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setMostrarPicker(false);
            if (selectedDate) {
              setFecha(selectedDate.toISOString().split('T')[0]);
            }
          }}
        />
      )}

      {/* Campo de hora con ícono */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Hora de ingreso" value={hora} editable={false} />
        <Ionicons name="time" size={28} color="gray" onPress={() => setMostrarPickerHora(true)} style={{ marginLeft: 20 }} />
      </View>
      {mostrarPickerHora && (
        <DateTimePicker
          value={hora ? new Date(hora) : new Date()}
          mode="time"
          display="default"
          onChange={(_, selectedTime) => {
            setMostrarPickerHora(false);
            if (selectedTime) {
              setHora(selectedTime.toISOString().split('T')[1].slice(0, 5));
            }
          }}
        />
      )}

      <Button title="Guardar registro" onPress={handleGuardar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { flex: 0.5, borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});
