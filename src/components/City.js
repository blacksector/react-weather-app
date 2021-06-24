import React from 'react'
import ReactBootstrap, { Container, Col, Row, Accordion, Card, Button } from 'react-bootstrap';



export default function City({ city }) {
    return (
        <>
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={city.id}>
                        {city.name}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={city.id}>
                    <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
            </Card>
            
        </>
    )
}