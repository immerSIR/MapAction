import React, {useState, useEffect} from "react";
import { config } from "config";
import {  useParams, useHistory } from 'react-router-dom';
import "../../node_modules/video-react/dist/video-react.css";
import axios from 'axios'; 
import Swal from 'sweetalert2';

export const IncidentData = () =>{
    const { incidentId } = useParams();
    const navigate = useHistory();

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const response = await axios.get(`${config.url}/MapApi/incident/${incidentId}`);
                console.log("reponse", response)
                setIncident(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de l\'incident :', error);
            }
        };
        if (incidentId) {
            fetchIncident(); 
        }
    }, [incidentId]);

    const [incident, setIncident] = useState({});
    const [videoIsLoading, setVideoIsLoading] = useState(false); 
    const imgUrl = incident ? config.url + incident.photo : '';
    const audioUrl = incident ? config.url + incident.audio : '';
    const videoUrl = incident ? config.url + incident.video : '';
    console.log(videoUrl)
    const latitude = incident?.lattitude || 0;
    const longitude = incident?.longitude || 0;
    const description = incident ? incident.description: '';
    const position = [latitude,longitude];
    const dataTostring = incident ? incident.created_at :'';
    const dateObject = new Date(dataTostring)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const date = dateObject.toLocaleDateString();
    console.log("la date",date)
    const heure = dateObject.toLocaleTimeString();
    const [isChanged, setisChanged]= useState(false)
    const [inProgress, setProgress]= useState(false)
    const [changeState, setState] = useState(false)
    const data =[]
    const [EditIncident, setEditIncident] = useState({
        title: '',
        zone: '',
        description: '',
        lattitude: '',
        longitude: '',
        user_id: '',
        etat: '',
        indicateur_id: '',
        category_ids: [],
    });

    const optionstype = [
        { label: 'En attente', value: 'declared' },
        { label: 'Prendre en compte', value: 'taken_into_account' },
        { label: 'Résolu', value: 'resolved' },
    ];

    const handleSelectChange = (selectedOption) => {
        console.log(selectedOption.value);
        setEditIncident({ ...EditIncident, etat: selectedOption.value });
        console.log(EditIncident);
    };
    
    const handleChangeStatus = async (e) => {
        e.preventDefault();
        setState(true);
    
        const action = EditIncident.etat;
        const url = config.url + '/MapApi/hadleIncident/' + incidentId;
        const token = sessionStorage.getItem('token');
    
        if (!token) {
            Swal.fire("Token not found. Please log in.");
            setState(false);
            setisChanged(false);
            return;
        }
    
        try {
            const response = await axios.post(url, { action }, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                }
            });
            console.log(response);
            setState(false);
            setisChanged(false);
            setEditIncident({
                title: '',
                zone: '',
                description: '',
                lattitude: '',
                longitude: '',
                user_id: '',
                etat: '',
                indicateur_id: '',
                category_ids: [],
            });
            Swal.fire('Changement de status effectué avec succès');
        } catch (error) {
            if (error.response && error.response.data.code === 'token_not_valid') {
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    const refreshResponse = await axios.post(config.url + '/api/token/refresh/', { refresh: refreshToken });
                    localStorage.setItem('token', refreshResponse.data.access);
                    const retryResponse = await axios.post(url, { action }, {
                        headers: {
                            Authorization: `Bearer ${refreshResponse.data.access}`, 
                        }
                    });
                    console.log(retryResponse);
                    setState(false);
                    setisChanged(false);
                    setEditIncident({
                        title: '',
                        zone: '',
                        description: '',
                        lattitude: '',
                        longitude: '',
                        user_id: '',
                        etat: '',
                        indicateur_id: '',
                        category_ids: [],
                    });
                    Swal.fire('Changement de status effectué avec succès');
                } catch (refreshError) {
                    console.log(refreshError);
                    Swal.fire("Session expired. Please log in again.");
                }
            } else {
                setState(false);
                setisChanged(false);
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                    Swal.fire("Désolé",
                        "Cet incident est déjà pris en compte."
                    );
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log(error.message);
                }
            }
        }
    };
    const handleNavigate = async () => {
        const userId = user.id;
        navigate(`/analyze/${incident.id}/${userId}`);

    };
    return {
        handleChangeStatus,
        latitude,
        longitude,
        videoUrl,
        imgUrl,
        audioUrl,
        optionstype,
        description,
        position,
        date,
        heure,
        videoIsLoading,
        handleNavigate,
        setVideoIsLoading,
        incident
    }
}    
    