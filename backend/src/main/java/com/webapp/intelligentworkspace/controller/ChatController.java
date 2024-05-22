package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/rooms/{roomId}")
    public Message sendMessage(@Payload Message chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/rooms/{roomId}")
    public Message addUser(@Payload Message chatMessage) {
        chatMessage.setContent(chatMessage.getSender() + " joined the room.");
        return chatMessage;
    }
}
