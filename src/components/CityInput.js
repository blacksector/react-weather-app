import React, { useState } from 'react';
import ReactBootstrap, { Form, Button } from 'react-bootstrap';


export default function CityInput(props) {
    const [cityName, setCityName] = useState('')
    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>City Name</Form.Label>
                    <Form.Control value={cityName} onChange={e => setCityName(e.target.value)} type="text" placeholder="Enter your city" />
                </Form.Group>
                <Button size="lg" block
                    onClick={e => {
                        props.onSubmitCity(cityName)
                        .then(resp => resp ? setCityName('') : null);
                    }}
                >Save</Button>
                <div class="separator">OR</div>
                <Button block
                    onClick={e => props.onGetCurrentLocation(cityName)}
                >Get Current Location</Button>

            </Form>
        </>
    )
}
