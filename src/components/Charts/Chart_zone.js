import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import {config} from '../../config'
import { useMonth } from 'Fonctions/Month';
import { useDateFilter } from 'Fonctions/YearMonth';
const ZoneChart = () => {
    const zoneToRegionMap = {
        'Faladiè-sema': 'Bamako',
        'Faladie Sema, Bamako, Mali': 'Bamako',
        'Faladie Sema': 'Bamako',
        'Faladie, Bamako, Mali': 'Bamako',
        'Torokorobougou': 'Bamako',
        'Kalaban': 'Bamako',
        'Sotuba': 'Bamako',
        'Kalaban Coura Aci': 'Bamako',
        'Kalaban Coura': 'Bamako',
        'Kalaban Coro': 'Bamako',
        'Kabala': 'Bamako',
        'Badalabougou': 'Bamako',
        'Aci 2000': 'Bamako',
        'Bagadadji': 'Bamako',
        'Bozola': 'Bamako',
        'Cité du Niger': 'Bamako',
        'Daoudabougou': 'Bamako',
        'Darsalam': 'Bamako',
        'Djélibougou': 'Bamako',
        'Faladié': 'Bamako',
        'Hamdalaye': 'Bamako',
        'Hippodrome': 'Bamako',
        'Korofina': 'Bamako',
        'Lafiabougou': 'Bamako',
        'Magnambougou': 'Bamako',
        'Missira': 'Bamako',
        'Niamakoro': 'Bamako',
        'Niarela': 'Bamako',
        'Quinzambougou': 'Bamako',
        'Sabalibougou': 'Bamako',
        'Sebenikoro': 'Bamako',
        'Sogoniko': 'Bamako',
        'Titi-Bougou': 'Bamako',
        'Yirimadio': 'Bamako',
        'Banconi': 'Bamako',
        'Boulkassoumbougou': 'Bamako',
        'Djelibougou': 'Bamako',
        'Fadjiguila': 'Bamako',
        'Kalabancoura': 'Bamako',
        'Kati (banlieue)': 'Bamako',
        'Médina Coura': 'Bamako',
        'Niamana': 'Bamako',
        'Sabalibougou': 'Bamako',
        'Samé': 'Bamako',
        'Senou': 'Bamako',
        'Sokorodji': 'Bamako',
        'Sotuba ACI': 'Bamako',
        'Siracoro': 'Bamako',
        'ATT-Bougou': 'Bamako',
        'Yobokondji': 'Bamako',
        'Bamako': 'Bamako',

         // Mopti
        'Sévaré': 'Mopti',
        'Mopti': 'Mopti',
        'Bandiagara': 'Mopti',
        'Djenné': 'Mopti',
        'Douentza': 'Mopti',
        'Youwarou': 'Mopti',
        'Tenenkou': 'Mopti',
        'Korientzé': 'Mopti',
        'Fatoma': 'Mopti',

        // Kayes
        'Kayes': 'Kayes',
        'Yélimané': 'Kayes',
        'Diéma': 'Kayes',
        'Nioro du Sahel': 'Kayes',
        'Bafoulabé': 'Kayes',
        'Mahina': 'Kayes',
        'Oussoubidiagna': 'Kayes',
        'Sadiola': 'Kayes',
        'Sagabari': 'Kayes',
        'Sandaré': 'Kayes',

        // Koulikoro
        'Koulikoro': 'Koulikoro',
        'Kati': 'Koulikoro',
        'Banamba': 'Koulikoro',
        'Fana': 'Koulikoro',
        'Kolokani': 'Koulikoro',
        'Dioïla': 'Koulikoro',
        'Nara': 'Koulikoro',
        'Kangaba': 'Koulikoro',

        // Sikasso
        'Sikasso': 'Sikasso',
        'Koutiala': 'Sikasso',
        'Bougouni': 'Sikasso',
        'Yanfolila': 'Sikasso', 
        'Kignan': 'Sikasso',
        'Zégoua': 'Sikasso',
        'Loulouni': 'Sikasso',
        'Sikoro': 'Sikasso',
        'Kadiolo': 'Sikasso',

        // Gao
        'Gao': 'Gao',
        'Bourem': 'Gao',
        'Ansongo': 'Gao',
        'Ménaka': 'Gao',
        'Talataye': 'Gao',
        'Tarkint': 'Gao',
        'Andéramboukane': 'Gao',

        // Tombouctou
        'Tombouctou': 'Tombouctou',
        'Goundam': 'Tombouctou',
        'Diré': 'Tombouctou',
        'Rharous': 'Tombouctou',
        'Niafunké': 'Tombouctou',
        'Léré': 'Tombouctou',
        'Tonka': 'Tombouctou',

        // Kidal
        'Kidal': 'Kidal',
        'Abeïbara': 'Kidal',
        'Tessalit': 'Kidal',
        'Essouk': 'Kidal',
        'Tin-Essako': 'Kidal',

        // Segou
        'Ségou': 'Ségou',
        'San': 'Ségou',
        'Bla': 'Ségou',
        'Tominian': 'Ségou',
        'Markala': 'Ségou',
        'Niono': 'Ségou',
        'Macina': 'Ségou',
        'Baraouéli': 'Ségou',
        'Dioro': 'Ségou',
        'Séribala': 'Ségou',

        // Taoudénit (nouvelle région)
        'Achouratt': 'Taoudénit',
        'Foum-Alba': 'Taoudénit',
        'Araouane': 'Taoudénit',
        'Bou-Djébéha': 'Taoudénit',

        // Ménaka (nouvelle région)
        'Anderamboukane': 'Ménaka',
        'Inékar': 'Ménaka',
        'Tidermène': 'Ménaka',
        
        // Regions of Kita and Zinder already included
        'Kita': 'Kita',
        'Zinder': 'Zinder',

        // Senegal

        // Dakar
        'Dakar': 'Dakar',
        'Pikine': 'Dakar',
        'Guédiawaye': 'Dakar',
        'Rufisque': 'Dakar',
        'Bargny': 'Dakar',
        'Keur Massar': 'Dakar',
        'Mbao': 'Dakar',
        'Parcelles Assainies': 'Dakar',
        'Yoff': 'Dakar',
        'Medina': 'Dakar',
        'Plateau': 'Dakar',
        'Fann-Point E': 'Dakar',
        'Hann Bel-Air': 'Dakar',
        'Grand Yoff': 'Dakar',
        'Ouakam': 'Dakar',
        'Ngor': 'Dakar',
        'Bambilor':'Dakar',

        // Thiès
        'Thiès': 'Thiès',
        'Tivaouane': 'Thiès',
        'Mbour': 'Thiès',
        'Saly': 'Thiès',
        'Popenguine': 'Thiès',
        'Ngaparou': 'Thiès',
        'Joal-Fadiouth': 'Thiès',
        'Sindia': 'Thiès',

        // Saint-Louis
        'Saint-Louis': 'Saint-Louis',
        'Richard-Toll': 'Saint-Louis',
        'Dagana': 'Saint-Louis',
        'Podor': 'Saint-Louis',

        // Ziguinchor
        'Ziguinchor': 'Ziguinchor',
        'Oussouye': 'Ziguinchor',
        'Bignona': 'Ziguinchor',
        'Cap Skirring': 'Ziguinchor',

        // Kaolack
        'Kaolack': 'Kaolack',
        'Nioro du Rip': 'Kaolack',
        'Guinguinéo': 'Kaolack',

        // Tambacounda
        'Tambacounda': 'Tambacounda',
        'Bakel': 'Tambacounda',
        'Koumpentoum': 'Tambacounda',
        'Kédougou': 'Tambacounda',

        // Kolda
        'Kolda': 'Kolda',
        'Vélingara': 'Kolda',
        'Médina Yoro Foulah': 'Kolda',

        // Matam
        'Matam': 'Matam',
        'Ranérou': 'Matam',
        'Kanel': 'Matam',

        // Louga
        'Louga': 'Louga',
        'Kébémer': 'Louga',
        'Linguère': 'Louga',
    };
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);
    const { selectedMonth } = useMonth();
    const { filterType, customRange } = useDateFilter();

    const _getZone = async () => {
        let url = `${config.url}/MapApi/incident-filter/?filter_type=${filterType}`;
        
        if (filterType === 'custom_range' && customRange[0].startDate && customRange[0].endDate) {
            url += `&custom_start=${customRange[0].startDate.toISOString().split('T')[0]}&custom_end=${customRange[0].endDate.toISOString().split('T')[0]}`;
        }
        
        try {
            if (!sessionStorage.token) {
                console.error("Token non trouvé");
                return;
            }
    
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.token}`,
                    'Content-Type': 'application/json',
                },
            });
            const incidents = res.data;
            const aggregatedData = {};
            incidents.forEach(incident => {
                const zone = incident.zone; 
                const region = zoneToRegionMap[zone] || 'Region inconnue'; 
                const userType = incident.user_id ? 'Inscrit' : 'Anonyme'; 
                if (!aggregatedData[region]) {
                    aggregatedData[region] = { Anonyme: 0, Inscrit: 0 };
                }
                aggregatedData[region][userType]++;
            });

            const labels = Object.keys(aggregatedData);
            const anonymeData = Object.values(aggregatedData).map(zoneData => zoneData.Anonyme);
            const inscritData = Object.values(aggregatedData).map(zoneData => zoneData.Inscrit);

            setChartOptions({
                chart: {
                    type: 'bar'
                },
                plotOptions: {
                    bar: {
                        horizontal: true
                    }
                },
                xaxis: {
                    categories: labels
                },
               
            });

            setChartSeries([
                {
                    name: 'Anonyme',
                    data: anonymeData
                },
                {
                    name: 'Inscrit',
                    data: inscritData
                }
            ]);
        } catch (error) {
            console.error(error.message);
            console.log("on voit pas le mois selectionné")
        }
    };

    useEffect(() => {
        _getZone();
    }, [filterType, customRange]);

    return (
        <div id="chart">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default ZoneChart;
