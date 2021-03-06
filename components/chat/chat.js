import React, {Component} from "react";
import {Row, Col, Form, Spinner as BootstrapSpinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import ChatFeed from "./chat-feed";
import {
    addMessage, addRooms,
    clearChat, clearSelectedRoom,
    getRooms,
    newRoom,
    receivedMessage,
    selectRoom, setChatAct, setChatProduct,
    setSelectedRoomMessage, updateCheckMessage, updateLoadMessage
} from "../../actions";
import {withGetData, withHookForm} from "../hoc-helpers";
import {connect} from "react-redux";
import TextareaAutosize from "react-autosize-textarea";
import {randomString} from "../../utils";
import {DataService} from "../../services";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import Link from "next/link";
import {withRouter} from "next/router";
import Spinner from "../spinner";
import LazyImg from "../lazy-img";
import ChatBubble from "./chat-bubble/chat-bubble";

const dataService = new DataService();
const checkMessages = AwesomeDebouncePromise(
    dataService.checkMessages,
    200
);
const qs = require('qs');

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
        if (prevProps.router.query.room !== this.props.router.query.room || prevProps.search !== this.props.search) {
            this.updateSelectRoom();
        }
    }

    componentWillUnmount() {
        const {clearChat, selected_room_id} = this.props;

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
        const {countRoom, newUser, newRoom, rooms, setChatAct, router, search, pathname, act, searchRoom, addRooms} = this.props;
        const newQuery = qs.parse(search.replace('?', ''));
        let room = rooms.find((item) => item.users[0].id === newUser.id);
        if (room) {
            delete newQuery.act;
            newQuery.room = room.room.id;
            setChatAct('');
            router.push(router.pathname, pathname + '?' + qs.stringify(newQuery), { shallow: true });
            return;
        }

        if (!room) {
            let roomId = null;
            searchRoom(newUser.id)
                .then((data) => {
                    addRooms([data]);
                    roomId = data.room.id;
                    newQuery.room = roomId;
                    setChatAct('');
                    return router.push(router.pathname, pathname + '?' + qs.stringify(newQuery), { shallow: true });
                })
                .catch( () => {
                    if (act === 'new' && newUser && !room) {
                        countRoom()
                            .then(count => {
                                newRoom({id: count + 1, user: newUser});
                                return count + 1
                            })
                            .then((roomId) => {
                                newQuery.room = roomId;
                                router.push(router.pathname, pathname +  '?' + qs.stringify(newQuery), { shallow: true });
                            })
                    }
                });
        }
    };

    updateSelectRoom = () => {
        const {selectRoom, addMessage, clearSelectedRoom, setSelectedRoomMessage, newUser = {id: null}, user, act, search, setChatAct} = this.props;
        let roomId = Number(qs.parse(search.replace('?', '')).room);

        if (act) {
            const query = qs.parse(search.replace('?', ''));
            roomId = Number(query.room);
        }

        if (!roomId) {
            clearSelectedRoom();
        }

        if(user.id !== newUser.id && newUser.id !== null && act === 'new' && !roomId) {
            this.selectNewRoom();
            return;
        }

        if(roomId) {
            selectRoom(roomId);
            checkMessages(roomId);

            if (!window.Echo.connector.channels[`private-room.${roomId}`]) {
                window.Echo.private(`room.${roomId}`)
                    .listen('.sendMessage', (data) => {
                        setSelectedRoomMessage(data.message);
                        addMessage({...data, id: user.id !== data.user_id ? 1 : 0, messageId: data.message_id});
                        checkMessages(roomId);
                    })
            }
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
        const {
            addMessage,
            setMessage,
            selected_room_id,
            selected_room,
            setNewRoom,
            chat,
            updateLoadMessage,
            setSelectedRoomMessage,
            search,
            act,
            setChatAct,
            setChatProduct
        } = this.props;

        const {value} = this.state;
        const trimmedValue = value.trimLeft().trimRight().replace(/\n{2,}/g, '\n').replace(/\s{2,}/g);
        const newMessageKey = randomString(6);

        addMessage({message: trimmedValue, id: 0, checked: 0, newMessageKey, product: chat.product});
        if (act === 'new') {
            const newQuery = qs.parse(search.replace('?', ''));
            delete newQuery.act;

            setNewRoom({message: trimmedValue, roomId: selected_room_id, users: selected_room.users, product_id: chat.product ? chat.product.id : null})
                .then((id) => {
                    setChatAct('');
                    updateLoadMessage({id, newMessageKey});
                    window.Echo.leaveChannel(`private-room.${selected_room_id}`);
                    window.Echo.private(`room.${selected_room_id}`)
                        .listen('.sendMessage', (data) => {
                            if (typeof data.message === 'string') {
                                setSelectedRoomMessage(data.message);
                                addMessage({...data, id: 1});
                                checkMessages(selected_room_id);
                            }
                        })
                });
            setSelectedRoomMessage(trimmedValue);
            setChatProduct(null);
            return this.setState({value: ''})
        }
        setMessage({message: trimmedValue, roomId: selected_room_id, product_id: chat.product ? chat.product.id : null})
            .then((id) => updateLoadMessage({id, newMessageKey}));
        setChatProduct(null);
        setSelectedRoomMessage(trimmedValue);
        setChatProduct(null);
        this.setState({value: ''})
    };

    onSelectRoom = (roomId) => {
        const {router, pathname, search, setChatAct} = this.props;
        const query = qs.parse(search.replace('?', ''));
        query.room = roomId;
        setChatAct('');

        if (router.pathname === '/chat') {
            router.push(router.pathname, pathname + '?' + qs.stringify(query), { shallow: true });
            return;
        }
        router.push(router.pathname, pathname + '?' + qs.stringify(query), { shallow: true });
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
            request,
            chat,
            isLogin
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

        if (!isLogin && typeof window !== 'undefined') {
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
                                request ?
                                    <div className="d-flex w-100 h-100">
                                        <BootstrapSpinner animation="border" className="m-auto"/>
                                    </div>
                                    : null
                            }
                            {
                                !request && rooms.length === 0 ?
                                    <div className="d-flex w-100 h-100">
                                        <h3 className="m-auto">Похоже у вас нет диалогов</h3>
                                    </div>
                                    : null
                            }
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
                                                                                room.users[0].is_breeder && room.users[0].company_name ?
                                                                                    room.users[0].company_name
                                                                                    : room.users[0].name
                                                                            }
                                                                        </h3>
                                                                    </div>
                                                                )
                                                        }
                                                    <div className="profile-info">
                                                        <h3 className="profile-title">
                                                            {
                                                                room.users[0].is_breeder && room.users[0].company_name ?
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
                                                            <Link href="/chat">
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
                                                            selected_room.users[0].is_breeder && selected_room.users[0].company_name ?
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
                                                                        selected_room.users[0].is_breeder && selected_room.users[0].company_name ?
                                                                            selected_room.users[0].company_name
                                                                            : selected_room.users[0].name
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
                                                        messages={messages}
                                                        chatBubble={ChatBubble}
                                                        bubblesCentered={false}
                                                    />
                                                )
                                                : <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                        }
                                        <Form  onSubmit={!getMessagesRequest ? this.submit : null}>
                                            {
                                                chat.product ?
                                                    <Form.Group className="m-0 d-flex justify-content-end">
                                                        <div className="d-inline-flex chat-divider right">
                                                            <div
                                                                className="chat-bubble-product align-items-end"
                                                            >
                                                                <Link href={"/reptiles/[id]"} as={"/reptiles/" + chat.product.id}>
                                                                    <a className="title">
                                                                        {chat.product.name}
                                                                    </a>
                                                                </Link>
                                                                <Link href={"/reptiles/[id]"} as={"/reptiles/" + chat.product.id}>
                                                                    <a className="product-img">
                                                                        {
                                                                            chat.product.product_images.length > 0 ?
                                                                                <LazyImg src={chat.product.product_images[0].img_src} className="img-fluid"/>
                                                                                : null
                                                                        }
                                                                    </a>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </Form.Group>
                                                    : null
                                            }
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

const mapStateToProps = ({profile: {user}, auth: {isLogin, loginRequest}, chat, router: {location: { pathname, search }}}) => ({
    user,
    chat,
    rooms: chat.rooms,
    messages: chat.messages,
    selected_room_id: chat.selected_room_id,
    selected_room: chat.selected_room,
    loginRequest,
    getMessagesRequest: chat.getMessagesRequest,
    pathname,
    search,
    act: chat.act,
    request: chat.request,
    isLogin,

});

const mapMethodsToProps = ({setMessage, checkMessages, countRoom, setNewRoom, searchRoom}) => ({
    setMessage,
    checkMessages,
    countRoom,
    setNewRoom,
    searchRoom
});

export default connect(mapStateToProps, {
    getRooms,
    addMessage,
    selectRoom,
    receivedMessage,
    clearChat,
    newRoom,
    clearSelectedRoom,
    updateLoadMessage,
    updateCheckMessage,
    setSelectedRoomMessage,
    addRooms,
    setChatAct,
    setChatProduct
})(withHookForm(withGetData(withRouter(Chat), mapMethodsToProps)));

