import React from 'react'
import ReactBootstrap, { Container, Col, Row, Accordion, Card, Button } from 'react-bootstrap';
import moment from 'moment';


export default function City({ city }) {
    let bg = "";
    let timezone = moment()
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
                        backgroundSize: 'contain',
                        backgroundPosition: 'center'
                    }}>
                    <Accordion.Toggle id={bg} as={Button} variant="link" eventKey={city.id}>
                        <div class="left">
                            <img src={'http://openweathermap.org/img/wn/' + city.weather[0].icon + '.png'} />
                            <div class="subLeft">
                                <span>{moment().utc().subtract(city.timezone * -1, 'seconds').format('LT')}</span>
                                <span class="cityName">{city.name}</span>
                            </div>
                        </div>
                        <div class="right">
                            {parseInt(city.main.temp)} &deg;
                        </div>
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={city.id}>
                    <Card.Body>
                        <p class="lead">Local Time:</p>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </>
    )
}