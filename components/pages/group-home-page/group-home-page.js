import React from 'react';
import { Row, Col } from 'react-bootstrap';



const GroupHomePage = () => {
    return (
        <Row>
            <Col xs={12} sm={6} md={4}>
                <div className="home-card">
                    <div className="home-card-img">
                        <img src="https://sun9-66.userapi.com/c855228/v855228689/1965b2/tHxS30gqRqI.jpg" alt="snake" className="img-fluid"/>
                    </div>
                    <div className="home-card-info">
                        <h3 className="title">Normal boa constrictor</h3>
                        <p className="availbe">768 активно</p>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default GroupHomePage;
