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
        'Faladie, Bamako, Mali': 'Bamako',
        'Torokorobougou': 'Bamako',
        'Kalaban': 'Bamako',
        'Sotuba': 'Bamako',
        'Kalaban Coura Aci': 'Bamako',
        'Kalaban Coura': 'Bamako',
        'Kalaban Coro': 'Bamako',
        'Kabala': 'Bamako',
        'Badalabougou': 'Bamako',
        'Bamako': 'Bamako',
        'Sévaré':'Mopti',
        'Mopti':'Mopti',
        'Zinder':'Zinder',
        'Kita':'Kita',
        'Sikasso':'Sikasso',
        'Gadougou':'Kita',

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
    }, [selectedMonth, filterType, customRange]);

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
