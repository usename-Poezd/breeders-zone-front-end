import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {connect} from 'react-redux';
import Spinner from "../../spinner";
import {Link} from "react-router-dom";
import {Pipes} from "../../../services";

const HomePage = ({activeKinds}) => {
    const pipes = new Pipes();

    return (
        <div>
            <Row className="justify-content-center">
                {
                    activeKinds.length === 0 ?
                        <Spinner/>
                        : null
                }
                {
                    activeKinds.map( (item) => (
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-3" key={'kind-' + item.id}>
                            <Link to={`/${item.group}/${pipes.toUrl(item.title_eng)}/morphs`} className="home-card">
                                <div className="home-card-img">
                                    <div className="img-container">
                                        <img src="https://sun9-66.userapi.com/c855228/v855228689/1965b2/tHxS30gqRqI.jpg" alt="snake" className="img-fluid"/>
                                    </div>
                                </div>
                                <div className="home-card-info">
                                    <h3>{item.title_rus}</h3>
                                </div>
                            </Link>
                        </Col>
                    ))
                }
            </Row>
        </div>
    );
};

const mapStateToProps = ({kinds: {active: activeKinds}}) => ({
    activeKinds
});

export default connect(mapStateToProps)(HomePage);
