import React, {Component} from "react";
import {setDivorce, setDivorceRequest} from "../../../actions";
import {DataService} from "../../../services";
import {connect} from "react-redux";
import DivorceSettings from "../../divorce-settings";
import Spinner from "../../spinner";
// import BreadCrumbs from "../../bread-crumbs";
import {Col, Row} from "react-bootstrap";
import {isLogin} from "../../../utils";
// import {Redirect} from "react-router";

const dataService = new DataService();

class DivorceSettingsPage extends Component{
    componentDidMount() {
        // this.getDivorce();
    }

    getDivorce = () => {
        const { setDivorce, setDivorceRequest, match: {params} } = this.props;

        if (params.divorceId) {
            setDivorceRequest();
            dataService.getDivorce(params.divorceId)
                .then( (data) => {
                    setDivorce({
                        ...data,
                        kindId: data.kind_id,
                        subcategoryId: data.subcategory_id,
                        sexPhotos: data.sex_photos,
                        masonryPhotos: data.masonry_photos,
                        exitPhotos: data.exit_photos
                    });
                    setDivorceRequest();
                })
        }
    };

    render() {
        const { loginRequest, divorce, allKinds, user, router } = this.props;

        if (!user.is_breeder && !isLogin() && typeof window !== 'undefined'){
            return router.push('/');
        }

        if(loginRequest || divorce.divorceRequest || divorce.updateRequest || allKinds.length === 0){
            return (
                <Row className="justify-content-center">
                    <Col xs={12} md={9} className="mt-3 py-5">
                        <Spinner/>
                    </Col>
                </Row>
            )
        }

        return (
            <React.Fragment>
                <DivorceSettings getDivorce={this.getDivorce}/>
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({divorce, kinds: {all: allKinds}, auth: {loginRequest}, profile: {user}}) => ({
    divorce,
    allKinds,
    loginRequest,
    user
});

export default connect(mapStateToProps, { setDivorce, setDivorceRequest })(DivorceSettingsPage);
