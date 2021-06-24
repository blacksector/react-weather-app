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
                <Button
                    onClick={e => {
                        props.onSubmitCity(cityName)
                        .then(resp => resp ? setCityName('') : null);
                    }}
                >Save</Button>
            </Form>
        </>
    )
}
