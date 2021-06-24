import React from 'react'
import ReactBootstrap, { Container, Col, Row, Accordion, Card, Button } from 'react-bootstrap';
import moment from 'moment';


export default function City({ city }) {

    function titleCase(str) {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }

    let windDirection = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"];
    let bg = "";
    if (city.weather[0].icon.indexOf('n') !== -1) {
        bg = 'night'
    } else {
        bg = 'after_noon';
    }
    return (
        <>
            <Card>
                <Card.Header class="card-bg" style={{
                    background: 'url("' + bg + '_cropped.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <Accordion.Toggle id={bg} as={Button} variant="link" eventKey={city.id}>
                        <div class="left">
                            <img src={'http://openweathermap.org/img/wn/' + city.weather[0].icon + '.png'} />
                            <div class="subLeft">
                                <span>{moment().utc().add(city.timezone, 'seconds').format('LT')}</span>
                                <span class="cityName">{city.name}</span>
                            </div>
                        </div>
                        <div class="right">
                            <span>{parseInt(city.main.temp)}&deg;</span>
                            <span>H: {parseInt(city.main.temp_max)}&deg; L: {parseInt(city.main.temp_min)}&deg;</span>

                        </div>
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={city.id}>
                    <Card.Body>
                        <div class="text-center weatherBody">
                            <p class="display-5">{city.name}, {city.sys.country}</p>
                            <p class="lead">{titleCase(city.weather[0].description)}</p>
                            <p class="display-2">{parseInt(city.main.temp)}&deg;</p>
                            <p>
                                Feels Like: {parseInt(city.main.feels_like)}&deg;
                            </p>
                            <Container>
                                <Row>
                                    <Col sm={6}>
                                        <small class="text-muted"><i class="fa fa-sun"></i> SUNRISE</small>
                                        <p class="lead">{moment(city.sys.sunrise*1000).utc().add(city.timezone, 'seconds').format('LT')}</p>
                                    </Col>
                                    <Col sm={6}>
                                        <small class="text-muted"><i class="fa fa-moon"></i> SUNSET</small>
                                        <p class="lead">{moment(city.sys.sunset*1000).utc().add(city.timezone, 'seconds').format('LT')}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={6}>
                                        <small class="text-muted"><i class="fa fa-water"></i> HUMIDITY</small>
                                        <p class="lead">{city.main.humidity}%</p>
                                    </Col>
                                    <Col sm={6}>
                                        <small class="text-muted"><i class="fa fa-wind"></i> WIND SPEED</small>
                                        <p class="lead">{windDirection[Math.round((city.wind.deg % 360)/22.5)]} {(city.wind.speed * 3.6).toFixed(2)} km/hr</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={6}>
                                        <small class="text-muted"><i class="fa fa-eye"></i> VISIBILITY</small>
                                        <p class="lead">{(city.visibility / 1000).toFixed(2)} km</p>
                                    </Col>
                                    <Col sm={6}>
                                        <small class="text-muted"><i class="fa fa-compress-alt"></i> PRESSURE</small>
                                        <p class="lead">{city.main.pressure} hPa</p>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </>
    )
}