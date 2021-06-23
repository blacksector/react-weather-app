import React, { useEffect, useState } from 'react';
import ReactBootstrap, { Container, Col, Row, Alert, Button } from 'react-bootstrap';


const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = '99b84d8baf9a2dbccdcf348d52979b99';
const WEATHER_APP_STORAGE = 'weatherApp.Storage';

export default function Weather() {

    const [location, setLocation] = useState({});

    useEffect(() => {
        setLocation(JSON.parse(localStorage.getItem(WEATHER_APP_STORAGE) || '{}'));
    }, [])

    useEffect(() => {
        localStorage.setItem(WEATHER_APP_STORAGE, JSON.stringify(location));
    }, [location])

    async function fetchWeather(url) {
        return fetch(url)
        .then(res => res.json())
        .then(result => {
            return result;
        });
    }

    function getWeather() {
        let url = `${API_URL}`;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const coords = {
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    };
                    url += `?lat=${coords.lat}&lon=${coords.long}&units=metric&appid=${API_KEY}`;
                    fetchWeather(url).then(data => setLocation(data));
                },
                function (error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                    url += `?q=Toronto&units=metric&appid=${API_KEY}`;
                    fetchWeather(url).then(data => setLocation(data));                
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            console.log("Cannot access navigator");
            url += `?q=Toronto&units=metric&appid=${API_KEY}`;
            fetchWeather(url).then(data => setLocation(data));
        }
        
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                    <Alert variant="primary">
                        The location name is {location.name}
                    </Alert>
                    <Button variant="primary" onClick={getWeather}>Get Weather</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
