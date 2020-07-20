import React, {Component} from "react";
import styles from "./styles";

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
            return (
                <ChatBubble
                    key={i}
                    message={message}
                    bubblesCentered={bubblesCentered}
                    bubbleStyles={bubbleStyles}
                />
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