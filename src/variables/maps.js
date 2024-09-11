import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { FaMapMarkerAlt, FaEye } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { config } from "config";
import L from "leaflet";
import axios from "axios";
import { useMonth } from "Fonctions/Month";
import { Button } from "@chakra-ui/react";
import { useIncidentData } from "Fonctions/Dash_fonction";
import { useDateFilter } from "Fonctions/YearMonth";

const position = [17.570692, -3.996166];

const Carte = ({ onShowIncident, showOnlyTakenIntoAccount, showOnlyResolved, showOnlyDeclared  }) => {
  const [positions, setPositions] = useState([]);
  const { filterType, customRange } = useDateFilter();
  const { selectedMonth } = useMonth();
  const [mapType, setMapType] = useState('standard');

  useEffect(() => {
    _getIncidents();
  }, [selectedMonth, filterType, customRange]);
  
  const _getUserById = async (userId) => {
    try {
      const res = await axios.get(`${config.url}/MapApi/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      });
      console.log(res.data.data, "lesssssssssssssssssssssssssssssssssssssssss")
      return res.data.data;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const _getIncidents = async () => {
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

      const validPositions = await Promise.all(
        incidents
          .filter(
            (incident) =>
              incident.lattitude !== null &&
              incident.longitude !== null &&
              !isNaN(incident.lattitude) &&
              !isNaN(incident.longitude)
          )
          .map(async (incident) => {
            const user = await _getUserById(incident.taken_by);
            return {
              id: incident.id,
              lat: incident.lattitude,
              lon: incident.longitude,
              tooltip: incident.title,
              desc: incident.description,
              etat: incident.etat,
              img: incident.photo,
              orgPhoto: user?.avatar || "", 
              video: config.url + incident.video,
              audio: config.url + incident.audio,
            };
          })
      );

      setPositions(validPositions);
    } catch (error) {
      console.error(error.message);
    }
  };

  const iconHTMLBlue = ReactDOMServer.renderToString(
    <FaMapMarkerAlt color="blue" size={20} />
  );

  const customMarkerIconBlue = new L.DivIcon({
    html: iconHTMLBlue,
  });

  const iconHTMLRed = ReactDOMServer.renderToString(
    <FaMapMarkerAlt color="red" size={20} />
  );

  const customMarkerIconRed = new L.DivIcon({
    html: iconHTMLRed,
  });

  const iconHTMLOrange = ReactDOMServer.renderToString(
    <FaMapMarkerAlt color="orange" size={20} />
  );

  const customMarkerIconOrange = new L.DivIcon({
    html: iconHTMLOrange,
  });

  return (
    <>
      <MapContainer center={position} zoom={6} style={{ height: '100%', width: '100%' }}>
        {mapType === 'standard' ? (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        ) : (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          />
        )}
        {positions.map((mark, idx) => (
          ((showOnlyTakenIntoAccount && mark.etat !== "taken_into_account") ||
            (showOnlyResolved && mark.etat !== "resolved") ||
            (showOnlyDeclared && mark.etat !== "declared")) ? null : (
            <Marker
              className="icon-marker"
              key={`marker-${idx}`}
              icon={
                mark.etat === "resolved"
                  ? customMarkerIconBlue
                  : mark.etat === "taken_into_account"
                    ? customMarkerIconOrange
                    : customMarkerIconRed
              }
              position={[mark.lat, mark.lon]}
            >
              <Popup>
                <span className="icon-marker-tooltip">
                  <ul>
                    <div className="row">
                      <div className="col-md-6">
                        <p>Voir l'incident</p>
                      </div>
                      <div className="col-md-6">
                        <img src={mark.img} alt="" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                        <img src={mark.orgPhoto} alt="" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                        <div>
                          <button
                            className="boutton button--round-l"
                            onClick={() => onShowIncident(mark.id)}
                          >
                            <FaEye color="#ccc" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </ul>
                </span>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      <Button onClick={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '2px solid black'
        }}
      >
        {mapType === 'standard' ? 'Vue Satellite' : 'Vue Standard'}
      </Button>
    </>
  );
};

export default Carte;
