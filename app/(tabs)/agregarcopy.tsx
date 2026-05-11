import React, { useEffect, useState } from 'react';
import { Text, Button, StyleSheet, ScrollView, Alert, View } from 'react-native';
import { initDB, guardarRegistro } from '../../database/dbveterinary';
import FormularioMascota from '../../components/PetRegistration';

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
    if (isNaN(numEdad) || numEdad.toString() !== edad || numEdad < 0 || numEdad > 30) {
      Alert.alert("Edad inválida", "Por favor, ingresa solo numeros enteros entre 0 y 30.");
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

    // Resetear campos
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
        <FormularioMascota
          nombre={nombre} setNombre={setNombre}
          especie={especie} setEspecie={setEspecie}
          edad={edad} setEdad={setEdad}
          peso={peso} setPeso={setPeso}
          dueno={dueno} setDueno={setDueno}
          correo={correo} setCorreo={setCorreo}
          vacunas={vacunas} setVacunas={setVacunas}
          alergias={alergias} setAlergias={setAlergias}
          condicion={condicion} setCondicion={setCondicion}
          observaciones={observaciones} setObservaciones={setObservaciones}
          fecha={fecha} setFecha={setFecha}
          mostrarPicker={mostrarPicker} setMostrarPicker={setMostrarPicker}
          hora={hora} setHora={setHora}
          mostrarPickerHora={mostrarPickerHora} setMostrarPickerHora={setMostrarPickerHora}
          modalVisible={modalVisible} setModalVisible={setModalVisible}
          especies={especies}
        />

        <Button title="Guardar registro" onPress={handleGuardar} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { padding: 20, backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderColor: '#ccc' },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
});
