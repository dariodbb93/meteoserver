import pkg from 'pg';
const { Client } = pkg;
import fetch from 'node-fetch';
import moment from 'moment-timezone';

fetch('https://api.openweathermap.org/data/2.5/weather?q=Pordenone,it&APPID=7cf2c6323148f49b971a1c86618f61db&units=metric')
    .then(response => response.json())
    .then(meteo => {
        data(meteo);
    })
    .catch(error => {
        console.error('Errore durante il recupero dei dati meteorologici:', error);
    });

function data(meteo) {
    let temperatura = meteo.main.temp;
    let tramonto = new Date(meteo.sys.sunset * 1000);
    let orarioTramonto = moment(tramonto).tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss');
    const client = new Client({
        user: 'dario',
        host: '193.70.115.204',
        database: 'meteo',
        password: 'HotDingo627',
        port: 5432,
        timezone : 'Europe/Rome',
    });

    client.connect();

    const query = 'INSERT INTO previsioni (temperatura, tramonto) VALUES ($1, $2)';
    const values = [temperatura, orarioTramonto];

    client.query(query, values, (err, res) => {
        if (err) {
            console.error('Errore durante l\'inserimento dei dati:', err);
        } else {
            console.log('Dati inseriti con successo nel database.');
        }

        client.end();
    });
}
