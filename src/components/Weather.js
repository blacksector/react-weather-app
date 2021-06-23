import React, { useEffect, useState } from 'react';
import ReactBootstrap, {Button} from 'react-bootstrap';


const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = '99b84d8baf9a2dbccdcf348d52979b99';

export default function Weather() {

    const [location, setLocation] = useState({});

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
                    url += `?lat=${coords.lat}&lon=${coords.long}&appid=${API_KEY}`;
                    fetchWeather(url).then(data => console.log(data));
                },
                function (error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                    url += `?q=Toronto&appid=${API_KEY}`;
                    fetchWeather(url).then(data => console.log(data));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            console.log("Cannot access navigator");
            url += `?q=Toronto&appid=${API_KEY}`;
            fetchWeather(url).then(data => console.log(data));        
        }
        
    }

    return (
        <div>
            <Button variant="primary" onClick={getWeather}>Get Weather</Button>
        </div>
    )
}
