import React, { useEffect, useState } from 'react';
import ReactBootstrap, { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import CityInput from './CityInput';
import '../FirstTime.css';


const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = '99b84d8baf9a2dbccdcf348d52979b99';
const WEATHER_APP_STORAGE = 'weatherApp.Storage';

export default function FirstTime(props) {

    const [location, setLocation] = useState([]);
    const [showCurrentButton, setShowCurrentButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [enterCity, setEnterCity] = useState(false);

    useEffect(() => {
        // Disable the get current location button if
        // geolocation isn't possible in device / browser
        if (navigator.geolocation) {
            setShowCurrentButton(true)
        }
        setLocation(JSON.parse(localStorage.getItem(WEATHER_APP_STORAGE + ".Cities") || '[]'));
    }, [])

    useEffect(() => {
        localStorage.setItem(WEATHER_APP_STORAGE + ".Cities", JSON.stringify(location));
    }, [location])

    async function fetchWeather(url) {
        return fetch(url)
        .then(res => res.json())
        .then(result => {
            return result;
        });
    }

    function getWeather(type = 'geo', city = '') {
        let url = `${API_URL}`;
        if (navigator.geolocation && type === "geo") {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const coords = {
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    };
                    url += `?lat=${coords.lat}&lon=${coords.long}&units=metric&appid=${API_KEY}`;
                    fetchWeather(url).then(data => setLocation(data));
                    setShowAlert(false);
                },
                function (error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                    // we are now going to estimate their location based on IP-API free look up
                    // this isn't accurate but it works:
                    fetch('http://ip-api.com/json/')
                    .then(res => res.json())
                    .then((result) => {
                        url += `?lat=${result.lat}&lon=${result.lon}&units=metric&appid=${API_KEY}`;
                        fetchWeather(url).then(data => setLocation(data));
                    })
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0
                }
            );
        } else if (type === "city") {
            url += `?q=${city}&units=metric&appid=${API_KEY}`;
            fetchWeather(url).then(data => setLocation(data));
        } else {
            setShowAlert(true);
            setAlertMessage("Please make sure you've filled out the city name.");
        }
        
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p class="display-4">Welcome to the Weather App!</p>
                        {showAlert && <Alert variant="danger">{alertMessage}</Alert>}
                        <p class="lead">Enter your city below or click the "Get Current Location" button to get started!</p>
                        
                        {enterCity === false && <Button
                            onClick={getWeather}
                        >Get Current Location</Button>}

                        {enterCity === false && <Button
                            onClick={() => setEnterCity(true)}>Enter City</Button>
                        }

                        {enterCity && <CityInput onSubmitCity={(v) => getWeather("city", v)} onGoBack={(v) => setEnterCity(false)} />}

                        <Button
                            onClick={e => props.onClick(true)}
                        >Done!</Button>
                    </Col>
                </Row>
            </Container>
            
        </>
    )
}
