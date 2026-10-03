const express = require('express');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// --- AUTENTICACIÓN USANDO EL ARCHIVO credentials.json ---
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = process.env.SPREADSHEET_ID;

// Configuración de Nodemailer para los correos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ==========================================
// --- RUTAS DEL CRUD: SOLICITUDES (GENERAL) ---
// ==========================================

app.get('/api/solicitudes', async (req, res) => {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Solicitudes!A:F', 
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return res.json([]);

        const data = rows.slice(1).map((row, index) => ({
            rowIndex: index + 2,
            fecha: row[0] || '',
            area: row[1] || '',
            folio: row[2] || '',
            expediente: row[3] || '',
            status: row[4] || ''
        }));

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al leer de Google Sheets (Solicitudes)' });
    }
});

app.post('/api/solicitudes', async (req, res) => {
    try {
        const { fecha, area, folio, expediente, status } = req.body;
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Solicitudes!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[fecha, area, folio, expediente, status]],
            },
        });

        res.json({ message: 'Solicitud registrada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar en Google Sheets (Solicitudes)' });
    }
});

app.put('/api/solicitudes/:row', async (req, res) => {
    try {
        const row = req.params.row;
        const { fecha, area, folio, expediente, status } = req.body;
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Solicitudes!A${row}:E${row}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[fecha, area, folio, expediente, status]],
            },
        });

        res.json({ message: 'Solicitud actualizada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar (Solicitudes)' });
    }
});

app.delete('/api/solicitudes/:row', async (req, res) => {
    try {
        const row = req.params.row;
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: `Solicitudes!A${row}:E${row}`,
        });

        res.json({ message: 'Solicitud eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar (Solicitudes)' });
    }
});


// ==========================================
// --- RUTAS DEL CRUD: SOLICITUDES DIF ---
// ==========================================

app.get('/api/solicitudes-dif', async (req, res) => {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'SolicitudesDIF!A:F', 
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return res.json([]);

        const data = rows.slice(1).map((row, index) => ({
            rowIndex: index + 2,
            fecha: row[0] || '',
            area: row[1] || '',
            folio: row[2] || '',
            expediente: row[3] || '',
            status: row[4] || ''
        }));

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al leer de Google Sheets (SolicitudesDIF)' });
    }
});

app.post('/api/solicitudes-dif', async (req, res) => {
    try {
        const { fecha, area, folio, expediente, status } = req.body;
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'SolicitudesDIF!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[fecha, area, folio, expediente, status]],
            },
        });

        res.json({ message: 'Solicitud DIF registrada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar en Google Sheets (SolicitudesDIF)' });
    }
});

app.put('/api/solicitudes-dif/:row', async (req, res) => {
    try {
        const row = req.params.row;
        const { fecha, area, folio, expediente, status } = req.body;
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `SolicitudesDIF!A${row}:E${row}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[fecha, area, folio, expediente, status]],
            },
        });

        res.json({ message: 'Solicitud DIF actualizada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar (SolicitudesDIF)' });
    }
});

app.delete('/api/solicitudes-dif/:row', async (req, res) => {
    try {
        const row = req.params.row;
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: `SolicitudesDIF!A${row}:E${row}`,
        });

        res.json({ message: 'Solicitud DIF eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar (SolicitudesDIF)' });
    }
});


// ==========================================
// --- TAREA PROGRAMADA (CRON JOB): ALERTAS 7 DÍAS PENDIENTES ---
// ==========================================
cron.schedule('10 10 * * *', async () => {
    console.log('Ejecutando revisión de solicitudes pendientes con 7+ días...');
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        let solicitudesAtrasadas = [];

        async function procesarHoja(nombreHoja, etiquetaOrigen) {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${nombreHoja}!A:E`,
            });

            const rows = response.data.values;
            if (!rows || rows.length <= 1) return;

            rows.slice(1).forEach((row) => {
                const fechaStr = row[0];
                const area = row[1];
                const folio = row[2];
                const expediente = row[3];
                const status = row[4];

                if (!fechaStr || !status || status.toLowerCase() !== 'pendiente') return;

                const [year, month, day] = fechaStr.split('-').map(Number);
                const fechaSolicitud = new Date(year, month - 1, day);
                fechaSolicitud.setHours(0, 0, 0, 0);

                const diferenciaDias = Math.floor((hoy - fechaSolicitud) / (1000 * 60 * 60 * 24));

                if (diferenciaDias >= 7) {
                    solicitudesAtrasadas.push({
                        origen: etiquetaOrigen,
                        fecha: fechaStr,
                        area: area,
                        folio: folio,
                        expediente: expediente,
                        dias: diferenciaDias
                    });
                }
            });
        }

        await procesarHoja('Solicitudes', 'General');
        await procesarHoja('SolicitudesDIF', 'DIF');

        if (solicitudesAtrasadas.length > 0) {
            let detalleHtml = '<h3>⚠️ Alerta: Las siguientes solicitudes siguen PENDIENTES y tienen 7 días o más de antigüedad:</h3><ul>';
            solicitudesAtrasadas.forEach(s => {
                detalleHtml += `<li><b>[${s.origen}]</b> <b>Folio:</b> ${s.folio} | <b>Expediente:</b> ${s.expediente} | <b>Área:</b> ${s.area} | <b>Fecha de Registro:</b> ${s.fecha} (<b>${s.dias} días</b> transcurridos)</li>`;
            });
            detalleHtml += '</ul>';

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.NOTIFICATION_EMAIL,
                subject: '⚠️ Alerta Urgente: Solicitudes Pendientes con más de 7 días',
                html: detalleHtml
            });

            console.log('Correo de alerta por solicitudes pendientes (7+ días) enviado con éxito.');
        }
    } catch (error) {
        console.error('Error en la tarea programada de correo:', error);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
