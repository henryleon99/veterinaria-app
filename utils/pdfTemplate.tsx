// utils/pdfTemplate.ts
export const generarPlantillaPDF = (mascota: any) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }
          h1 {
            color: #2a9d8f;
            text-align: center;
            margin-bottom: 30px;
            margin-top: 15px;
          }
          h2 {
            color: #141414;
            font-size: 18px;
            margin-top: 30px;
            text-align: left;
          }
          p {
            font-size: 14px;
            margin: 5px 0;
            text-align: left;
          }
          strong {
            font-weight: bold;
            color: #000;
          }
          .contenedor {
            width: 70%;              /* ancho controlado */
            margin: 40px auto;          /* centra el bloque horizontalmente */
            padding: 20px;           /* espacio interno como márgenes de Word */
            border: none;            /* sin bordes visibles */
            text-align: left;        /* texto alineado a la izquierda dentro */
          }
        </style>
      </head>
      <body>
        <h1>Reporte Veterinario</h1>

        <div class="contenedor">
          <h2>1. Datos de la Mascota</h2>
          <p><strong>Nombre:</strong> ${mascota.nombre}</p>
          <p><strong>Especie:</strong> ${mascota.especie}</p>
          <p><strong>Edad:</strong> ${mascota.edad}</p>
          <p><strong>Dueño:</strong> ${mascota.dueno}</p>

          <h2>2. Información Médica</h2>
          <p><strong>Vacunas:</strong> ${mascota.vacunas}</p>
          <p><strong>Alergias:</strong> ${mascota.alergias}</p>

          <h2>3. Condición Actual</h2>
          <p><strong>Condición:</strong> ${mascota.condicion}</p>
          <p><strong>Observaciones:</strong> ${mascota.observaciones}</p>
          <p><strong>Fecha:</strong> ${mascota.fecha}</p>
          <p><strong>Hora:</strong> ${mascota.hora}</p>
        </div>
      </body>
    </html>
  `;
};




