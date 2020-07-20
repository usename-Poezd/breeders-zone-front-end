import React, {Component} from "react";
import ChatBabble from "../chat-bubble";
import ScrollBars from "react-custom-scrollbars";
import BubbleGroup from "../bubble-group";
import styles from "./styles";

class ChatFeed extends Component {

    componentDidMount() {
        this.scrollbar.current.scrollToBottom();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.message !== this.props.messages) {
            if (this.scrollbar.current.getValues().top >= 0.96) {
                this.scrollbar.current.scrollToBottom();
            }
        }
    }

    scrollbar = React.createRef();

    renderMessages = (messages)  => {
        const { bubbleStyles, showSenderName } = this.props;

        const ChatBubble = ChatBabble;

        let group = [];

        // return nodes
        return messages.map((message, index) => {
            group.push(message);
            // Find diff in message type or no more messages
            if (index === messages.length - 1 || messages[index + 1].id !== message.id) {
                const messageGroup = group;
                group = [];
                return (
                    <BubbleGroup
                        key={index}
                        messages={messageGroup}
                        id={message.id}
                        showSenderName={showSenderName}
                        chatBubble={ChatBubble}
                        bubbleStyles={bubbleStyles}
                    />
                );
            }

            return null;
        });
    };


    render() {
        return (
            <div id="chat-panel" style={styles.chatPanel}>
                <ScrollBars
                    autoHide
                    ref={this.scrollbar}
                >
                    <div
                        className="chat-history"
                        style={{ ...styles.chatHistory }}
                    >
                        <div className="chat-messages">
                            {this.renderMessages(this.props.messages)}
                        </div>
                    </div>
                </ScrollBars>
            </div>
        );
    }
}

export default ChatFeed;