import React, {Component} from "react";
import {Row, Col, Form, Spinner as BootstrapSpinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCircle, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {ChatBubble, ChatFeed, Message} from 'react-chat-ui';
import {
    addMessage,
    clearChat, clearSelectedRoom,
    getMessages,
    getRooms,
    newRoom,
    receivedMessage,
    selectRoom,
    setRooms, setSelectedRoomMessage, updateCheckMessage, updateLoadMessage
} from "../../actions";
import {withGetData, withHookForm} from "../hoc-helpers";
import {connect} from "react-redux";
import TextareaAutosize from "react-autosize-textarea";
import Linkify from 'react-linkify';
import {faClock} from "@fortawesome/free-regular-svg-icons";
import {isLogin, randomString} from "../../utils";
import {DataService} from "../../services";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import Link from "next/link";
import {withRouter} from "next/router";
import Spinner from "../spinner";

const dataService = new DataService();
const checkMessages = AwesomeDebouncePromise(
    dataService.checkMessages,
    200
);
const qs = require('qs');

const LinkifyBabble = (props) => {
    return (
        <Linkify>
            <div className="chat-bubble-wrap">
                <div
                    className="chat-bubble"
                    style={
                        props.message.id === 1 ?
                            {
                                'backgroundColor': 'rgb(204, 204, 204)',
                                'float': 'left'
                            }
                            : null
                    }
                >
                    {
                        !props.message.messageId ?
                            (
                                <div className="message-status">
                                    <FontAwesomeIcon icon={faClock} size="lg"/>
                                </div>
                            )
                            : null
                    }
                    {
                        !props.message.checked  && props.message.messageId ?
                            (
                                <div className="message-status">
                                    <FontAwesomeIcon icon={faCircle} size="lg"/>
                                </div>
                            )
                            : null
                    }
                    <p>{props.message.message}</p>
                </div>
            </div>
        </Linkify>
    )
}

class Chat extends Component {

    state = {
        value: '',
        isMobile: false
    };

    componentDidMount() {
        const {getRooms} = this.props;
        this.onResize();
        window.addEventListener('resize', this.onResize);
        getRooms()
            .then( () => {
                this.updateSelectRoom();
            });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.router.query !== this.props.router.query) {
            this.updateSelectRoom();
        }
    }

    componentWillUnmount() {
        const {clearChat, selected_room_id, router, pathname} = this.props;
        const newQuery = router.query;
        if (newQuery.act) {
            delete newQuery.act;
        }
        if (newQuery.room) {
            delete newQuery.room
        }

        if (router.query.act || router.query.room) {
            router.push(pathname + '?' + qs.stringify(newQuery));
        }

        clearChat();
        window.removeEventListener('resize', this.onResize);
        if (window.Echo) {
            window.Echo.leaveChannel(`private-room.${selected_room_id}`);
        }

    }

    onResize = () => {
         if(window.outerWidth < 576) {
             this.setState({isMobile: true});
         } else {
             this.setState({isMobile: false});
         }
    };

    selectNewRoom = () => {
        const {countRoom, newUser, newRoom, rooms, selectRoom, router, pathname} = this.props;
        const act = router.query.act;
        const newQuery = router.query;
        const room = rooms.find((item) => item.users[0].id === newUser.id);

        if (room) {
            delete newQuery.act;
            newQuery.room = room.room.id;
            router.push(pathname + '?' + qs.stringify(newQuery));
            return;
        }

        if (act === 'new' && newUser && !room) {
            countRoom()
                .then(count => {
                    newRoom({id: count + 1, user: newUser});
                    return count + 1
                })
                .then((roomId) => router.push(pathname + (qs.stringify(router.query) ? '?' + qs.stringify(router.query) + `&room=${roomId}` : `?room=${roomId}`)))
        }
    };

    updateSelectRoom = () => {
        const {selectRoom, addMessage, clearSelectedRoom, router, setSelectedRoomMessage, newUser = {id: null}, user} = this.props;
        const roomId = Number(router.query.room);
        const act = router.query.act;

        if (!roomId) {
            clearSelectedRoom();
        }

        if(user.id !== newUser.id && newUser.id !== null && act === 'new') {
            this.selectNewRoom();
            return;
        }

        if(roomId && act !== 'new') {
            selectRoom(roomId);
            checkMessages(roomId);

            window.Echo.private(`room.${roomId}`)
                .listen('.sendMessage', (data) => {
                    setSelectedRoomMessage(data.message);
                    addMessage({...data, id: 1});
                    checkMessages(roomId);
                })
                .listenForWhisper('check-message', (e) => console.log(e));

        }
    };


    handelKeyDown = (e) => {
        if (this.props.getMessagesRequest){
            return;
        }

        const {value} = this.state;
        if (!value.trim()) {
            return false;
        }

        if (e.key === 'Enter' && e.shiftKey) {
            const {value} = this.state;
            this.setState({ value: value + '\n'})
        }else if (e.key === 'Enter') {
            this.submit(e)
        }
    };

    handelChange = (e) => {
        if (this.props.getMessagesRequest){
            return;
        }
        this.setState({value: e.target.value})
    };

    submit = (e) => {
        e.preventDefault();
        const {addMessage, setMessage, selected_room_id, selected_room, setNewRoom, router, updateLoadMessage, setSelectedRoomMessage, pathname, search} = this.props;
        const act = router.query.act;

        const {value} = this.state;
        const trimmedValue = value.trimLeft().trimRight().replace(/\n{2,}/g, '\n').replace(/\s{2,}/g);
        const newMessageKey = randomString(6);

        addMessage({message: trimmedValue, id: 0, checked: 0, newMessageKey});
        if (act === 'new') {
            const newQuery = router.query;
            delete newQuery.act;

            setNewRoom({message: trimmedValue, roomId: selected_room_id, users: selected_room.users})
                .then((id) => {
                    updateLoadMessage({id, newMessageKey});
                    router.push(pathname + (qs.stringify(newQuery) ? '?' + qs.stringify(newQuery) : `?room=${selected_room_id}`));
                });
            setSelectedRoomMessage(trimmedValue);
            return this.setState({value: ''})
        }
        setMessage({message: trimmedValue, roomId: selected_room_id})
            .then((id) => updateLoadMessage({id, newMessageKey}));
        setSelectedRoomMessage(trimmedValue);
        this.setState({value: ''})
    };

    onSelectRoom = (roomId) => {
        const { selectRoom, router, pathname, search } = this.props;
        router.push( pathname + (search ? search + `&room=${roomId}`: `?room=${roomId}`));
        selectRoom(roomId);
    };

    render() {
        const {value, isMobile} = this.state;
        const {
            rooms,
            selected_room_id,
            selected_room,
            messages,
            getMessagesRequest,
            user,
            newUser = { id: null },
            router,
            loginRequest,
        } = this.props;


        if(loginRequest){
            return (
                <Row className="justify-content-center">
                    <Col xs={12} md={8} className="feather-shadow mt-3 py-5">
                        <Spinner/>
                    </Col>
                </Row>
            )
        }

        if (!isLogin() && typeof window !== 'undefined') {
            router.push('/login');
        }

        if (user.id === newUser.id) {
            return (
                <h3>Вы не можете написать сами себе</h3>
            )
        }

        return (
            <Row className="justify-content-center mt-3">
                <Col xs={12} md={10}>
                    <div className="d-flex feather-shadow chat">
                        <div className={"chat-rooms" + (isMobile &&  selected_room_id === null ? ' w-100' : '') + (isMobile &&  selected_room_id !== null ? ' d-none' : '')}>
                            {
                                rooms.map( (room, idx) => {
                                    return (
                                            <div key={`room-${room.room.id}`} className={"chat-rooms-item " + (selected_room_id === room.room.id ? 'selected' : '')} onClick={() => this.onSelectRoom(room.room.id)}>
                                                <div className="profile align-items-start py-1">

                                                        {
                                                            room.users[0].logo_img_url ?
                                                                (
                                                                    <img className="img-fluid profile-img" src={room.users[0].logo_img_url} alt="fds"/>
                                                                ) : (
                                                                    <div  className="profile-img d-flex">
                                                                        <h3 className="d-inline-block m-auto">
                                                                            {
                                                                                room.users[0].is_breeder ?
                                                                                    room.users[0].company_name[0]
                                                                                    : room.users[0].name[0]
                                                                            }
                                                                        </h3>
                                                                    </div>
                                                                )
                                                        }
                                                    <div className="profile-info">
                                                        <h3 className="profile-title">
                                                            {
                                                                room.users[0].is_breeder ?
                                                                    room.users[0].company_name
                                                                    : room.users[0].name
                                                            }
                                                        </h3>
                                                        <p>
                                                            {
                                                                room.message
                                                            }
                                                        </p>
                                                    </div>
                                                    {
                                                        room.newMessage ? (
                                                            <span  className="message-count">{room.newMessageCount}</span>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                    )
                                })
                            }
                        </div>
                        {
                            selected_room_id !== null ?
                                (
                                    <div className={"chat-body d-flex flex-column justify-content-between" + (isMobile ? ' w-100' : '')}>
                                        <div className="chat-profile">
                                            <div className="profile">
                                                {
                                                    isMobile ?
                                                        (
                                                            <Link to="/chat">
                                                                <a className="chat-back">
                                                                    <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                                                                </a>
                                                            </Link>
                                                        )
                                                        : null
                                                }
                                                <div className="profile-info">
                                                    <h3 className="profile-title">
                                                        {
                                                            selected_room.users[0].is_breeder ?
                                                                selected_room.users[0].company_name
                                                                : selected_room.users[0].name
                                                        }
                                                    </h3>
                                                </div>
                                                {
                                                    selected_room.users[0].logo_img_url ?
                                                        (
                                                            <img className="img-fluid profile-img" src={ selected_room.users[0].logo_img_url} alt="fds"/>
                                                        ) : (
                                                            <div  className="profile-img d-flex">
                                                                <h3 className="d-inline-block m-auto">
                                                                    {
                                                                        selected_room.users[0].is_breeder ?
                                                                            selected_room.users[0].company_name[0]
                                                                            : selected_room.users[0].name[0]
                                                                    }
                                                                </h3>
                                                            </div>
                                                        )
                                                }
                                            </div>
                                        </div>
                                        {
                                            !getMessagesRequest ?
                                                (
                                                    <ChatFeed
                                                        messages={messages} // Boolean: list of message objects
                                                        // isTyping={this.state.is_typing} // Boolean: is the recipient typing
                                                        // Boolean: use our input, or use your own
                                                        // show the name of the user who sent the message
                                                        chatBubble={LinkifyBabble}
                                                        bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
                                                        //JSON: Custom bubble styles
                                                    />
                                                )
                                                : <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                        }
                                        <Form  onSubmit={!getMessagesRequest ? this.submit : null}>
                                            <Form.Group className="my-1 d-flex justify-content-beetwen align-items-end">
                                                <TextareaAutosize name="message" value={value} id="msg" className="w-100 form-control" onKeyDown={this.handelKeyDown} onChange={this.handelChange}/>
                                                <button className={"btn btn-second-bn " + (!value.trim() && !getMessagesRequest ? 'disabled' : '')} onClick={(e) => !value.trim() && !getMessagesRequest ? e.preventDefault() : 's'} type="submit">
                                                    <FontAwesomeIcon icon={faPaperPlane} size="lg"/>
                                                </button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                ) : (
                                    <div className={"chat-body" + (isMobile ? ' d-none' : ' d-flex')}>
                                        <h3 className="m-auto">Пожалуйста, выберите беседу</h3>
                                    </div>
                                )
                        }
                    </div>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = ({profile: {user}, auth: {loginRequest}, chat: {messages, rooms, selected_room_id, selected_room, getMessagesRequest}, router: {location: { pathname, search }}}) => ({
    user,
    rooms,
    messages,
    selected_room_id,
    selected_room,
    loginRequest,
    getMessagesRequest,
    pathname,
    search
});

const mapMethodsToProps = ({setMessage, checkMessages, countRoom, setNewRoom}) => ({
    setMessage,
    checkMessages,
    countRoom,
    setNewRoom
});

export default connect(mapStateToProps, { getRooms, addMessage, selectRoom, receivedMessage, clearChat, newRoom, clearSelectedRoom, updateLoadMessage, updateCheckMessage, setSelectedRoomMessage })(withHookForm(withGetData(withRouter(Chat), mapMethodsToProps)));
