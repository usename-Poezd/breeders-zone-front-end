import React, {Component} from "react";
import styles from "./styles";
import * as moment from "moment";

class BubbleGroup extends Component {
    /**
     * Parses and collects messages of one type to be grouped together.
     * @return {messageNodes} - a JSX wrapped group of messages
     */
    renderGroup(messages, id) {
        const {
            bubblesCentered,
            bubbleStyles,
            showSenderName,
            chatBubble,
            senderName,
        } = this.props;
        const ChatBubble = chatBubble;
        const sampleMessage = messages[0];

        const messageNodes = messages.map((message, i) => {

            if (message.type === 'date') {
                return (
                    <div key={`date${message.date}`} className="d-flex justify-content-center mt-4">
                        <p style={{fontSize: '14px'}}>{message.date}</p>
                    </div>
                )
            }

            return (
                <React.Fragment key={i}>
                    <ChatBubble
                        message={message}
                        bubblesCentered={bubblesCentered}
                        bubbleStyles={bubbleStyles}
                    />
                </React.Fragment>
            );
        });

        return (
            <div style={styles.chatbubbleWrapper}>
                {showSenderName &&
                ((senderName || sampleMessage.senderName) !== '' &&
                    (sampleMessage.id !== 0 && (
                        <h5 style={styles.bubbleGroupHeader}>
                            {senderName || sampleMessage.senderName}
                        </h5>
                    )))}
                {messageNodes}
            </div>
        );
    }

    render() {
        const { messages, id } = this.props;
        return this.renderGroup(messages, id);
    }
}

export default BubbleGroup;
