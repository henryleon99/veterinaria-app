import React from 'react';
import { Text, TextInput, View, Modal, TouchableOpacity, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  nombre: string;
  setNombre: (text: string) => void;
  especie: string;
  setEspecie: (text: string) => void;
  edad: string;
  setEdad: (text: string) => void;
  peso: string;
  setPeso: (text: string) => void;
  dueno: string;
  setDueno: (text: string) => void;
  correo: string;
  setCorreo: (text: string) => void;
  vacunas: string;
  setVacunas: (text: string) => void;
  alergias: string;
  setAlergias: (text: string) => void;
  condicion: string;
  setCondicion: (text: string) => void;
  observaciones: string;
  setObservaciones: (text: string) => void;
  fecha: string;
  setFecha: (text: string) => void;
  mostrarPicker: boolean;
  setMostrarPicker: (val: boolean) => void;
  hora: string;
  setHora: (text: string) => void;
  mostrarPickerHora: boolean;
  setMostrarPickerHora: (val: boolean) => void;
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  especies: string[];
}

const FormularioMascota: React.FC<Props> = (props) => {
  const {
    nombre, setNombre, especie, setEspecie, edad, setEdad, peso, setPeso,
    dueno, setDueno, correo, setCorreo, vacunas, setVacunas, alergias, setAlergias,
    condicion, setCondicion, observaciones, setObservaciones,
    fecha, setFecha, mostrarPicker, setMostrarPicker,
    hora, setHora, mostrarPickerHora, setMostrarPickerHora,
    modalVisible, setModalVisible, especies
  } = props;

  return (
    <View>
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

      <TextInput style={styles.input} placeholder="Edad aproximada" value={edad} keyboardType="numeric" onChangeText={(text) =>{
        const soloEnteros = text.replace(/[^0-9]/g, '');
        setEdad(soloEnteros);
      }} />
      <TextInput style={styles.input} placeholder="Peso (kg)" value={peso} keyboardType="decimal-pad" onChangeText={setPeso} />
      <TextInput style={styles.input} placeholder="Nombre del dueño" value={dueno} onChangeText={setDueno} />
      <TextInput style={styles.input} placeholder="Correo del dueño" value={correo} onChangeText={setCorreo} keyboardType="email-address" />

      <TextInput style={styles.input} placeholder="Tipo de vacunas aplicadas" value={vacunas} onChangeText={setVacunas} />
      <TextInput style={styles.input} placeholder="Alergias conocidas" value={alergias} onChangeText={setAlergias} />
      <TextInput style={styles.input} placeholder="Condición actual" value={condicion} onChangeText={setCondicion} />
      <TextInput style={styles.input} placeholder="Observaciones" value={observaciones} onChangeText={setObservaciones} />

      {/* Fecha */}
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

      {/* Hora */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { marginLeft: 10 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  option: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default FormularioMascota;
