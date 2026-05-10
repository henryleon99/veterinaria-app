import React, { useEffect, useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView, Alert, View, Modal, TouchableOpacity } from 'react-native';
import { initDB, guardarRegistro } from '../../database/dbveterinary';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; 

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [dueno, setDueno] = useState('');
  const [correo, setCorreo] = useState('');
  const [vacunas, setVacunas] = useState('');
  const [alergias, setAlergias] = useState('');
  const [condicion, setCondicion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fecha, setFecha] = useState('');
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [hora, setHora] = useState('');
  const [mostrarPickerHora, setMostrarPickerHora] = useState(false);

  // Modal para especie
  const [modalVisible, setModalVisible] = useState(false);
  const especies = ["Perro", "Gato", "Conejo", "Tortuga", "Hámster"];

  useEffect(() => {
    initDB();
  }, []);

  const handleGuardar = () => {
    if (!nombre.trim() || !especie.trim() || !edad.trim() || !peso.trim() || !dueno.trim() || !correo.trim() || !condicion.trim() || !fecha.trim() || !hora.trim()) {
      Alert.alert("Campos incompletos", "Por favor, completa todos los campos obligatorios.");
      return;
    }

    const numEdad = parseInt(edad, 10);
    if (isNaN(numEdad) || numEdad < 0 || numEdad > 30) {
      Alert.alert("Edad inválida", "Por favor, ingresa una edad válida (0-30).");
      return;
    }

    const numPeso = parseFloat(peso);
    if (isNaN(numPeso) || numPeso < 0 || numPeso > 200) {
      Alert.alert("Peso inválido", "Por favor, ingresa un peso válido (0-200 kg).");
      return;
    }

    guardarRegistro({
      nombre,
      especie,
      edad: numEdad,
      peso: numPeso,
      dueno,
      correo,
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
    setPeso('');
    setDueno('');
    setCorreo('');
    setVacunas('');
    setAlergias('');
    setCondicion('');
    setObservaciones('');
    setFecha('');
    setHora('');
    Alert.alert("Registro guardado", "La información de la mascota ha sido guardada exitosamente.");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Registro de Mascota</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
        <TextInput style={styles.input} placeholder="Nombre del animal" value={nombre} onChangeText={setNombre} />

        {/* Especie con Modal */}
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text>{especie || "Selecciona especie..."}</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {especies.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    setEspecie(item);
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

        <TextInput style={styles.input} placeholder="Edad aproximada" value={String(edad)} keyboardType="numeric" onChangeText={setEdad} />
        <TextInput style={styles.input} placeholder="Peso (kg)" value={String(peso)} keyboardType="decimal-pad" onChangeText={setPeso} />
        <TextInput style={styles.input} placeholder="Nombre del dueño" value={dueno} onChangeText={setDueno} />
        <TextInput style={styles.input} placeholder="Correo del dueño" value={correo} onChangeText={setCorreo} keyboardType="email-address" />

        <TextInput style={styles.input} placeholder="Tipo de vacunas aplicadas" value={vacunas} onChangeText={setVacunas} />
        <TextInput style={styles.input} placeholder="Alergias conocidas" value={alergias} onChangeText={setAlergias} />
        <TextInput style={styles.input} placeholder="Condición actual" value={condicion} onChangeText={setCondicion} />
        <TextInput style={styles.input} placeholder="Observaciones" value={observaciones} onChangeText={setObservaciones} />

        {/* Fecha con ícono en la misma línea */}
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Fecha de ingreso" value={fecha} editable={false} />
          <Ionicons name="calendar" size={28} color="gray" onPress={() => setMostrarPicker(true)} style={styles.icon} />
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

        {/* Hora con ícono en la misma línea */}
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Hora de ingreso" value={hora} editable={false} />
          <Ionicons name="time" size={28} color="gray" onPress={() => setMostrarPickerHora(true)} style={styles.icon} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { padding: 20, backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderColor: '#ccc' },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { marginLeft: 10 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  option: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
