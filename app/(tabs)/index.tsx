import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Collapsible } from '@/components/ui/collapsible';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/veterinaria.jpg')}
          style={styles.veterinariaLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Bienvenido a tu app veterinaria!</ThemedText>
        
      </ThemedView>

      <Collapsible title="Paso 1: Ingresa los datos de tu mascota">
        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.subtitle}>
           El usuario comienza registrando la información principal de la mascota.
          </ThemedText>
           <ThemedText style={styles.listItem}>• Nombre del animal</ThemedText>
           <ThemedText style={styles.listItem}>• Especie (perro, gato, etc.)</ThemedText>
           <ThemedText style={styles.listItem}>• Edad aproximada</ThemedText>
           <ThemedText style={styles.listItem}>• Nombre del dueño</ThemedText>  
       </ThemedView>
      </Collapsible>

      <Collapsible title="Paso 2: Ingresa información médica">
        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.subtitle}>
          Permite guardar datos clínicos relevantes para futuras consultas.</ThemedText>
        <ThemedText>
         • Vacunas aplicadas{"\n"}
         • Alergias conocidas{"\n"}
         • Historial de enfermedades
       </ThemedText>
       </ThemedView>
      </Collapsible>


      <Collapsible title="Paso 3: Identifica la condición actual">
        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.subtitle}>
           El veterinario o usuario describe el motivo de la visita
          </ThemedText>
        <ThemedText>
         • Tipo de lesion o sintoma{"\n"}
         • Observaciones del estado físico{"\n"}
         • Fecha de ingreso
       </ThemedText>
       </ThemedView>
      </Collapsible>

      <Collapsible title="Paso 4: Guardar y visualizar registro">
        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.subtitle}>
           El sistema almacena los datos y muestra en la lista de animales
          </ThemedText>
        <ThemedText>
         • Confirmar información{"\n"}
         • Guardar en la base local o nube{"\n"}
         • Consultar en la pantalla de lista
       </ThemedText>
       </ThemedView>
      </Collapsible>

    </ParallaxScrollView>
  
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  listItem: {
  fontSize: 16,
  lineHeight: 22,
},

  reactLogo: {
    height: 178,
    width: 500,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  veterinariaLogo: {
    width: '100%',
    aspectRatio: 7/5,
    resizeMode: 'cover',
  },
 
});
