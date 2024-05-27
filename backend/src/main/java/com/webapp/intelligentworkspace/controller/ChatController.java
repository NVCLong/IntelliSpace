package com.webapp.intelligentworkspace.controller;
import com.webapp.intelligentworkspace.model.ChatMessage;
import com.webapp.intelligentworkspace.model.request.WebRTCMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ChatController {

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public ChatMessage sendMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessage chatMessage
    ) {
        chatMessage.setRoomId(roomId);
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    @MessageMapping("/offer/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public WebRTCMessage sendOffer(@DestinationVariable String roomId,@Payload WebRTCMessage message) {
        return message;
    }

    @MessageMapping("/answer/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public WebRTCMessage sendAnswer(@DestinationVariable String roomId,@Payload WebRTCMessage message) {
        return message;
    }

    @MessageMapping("/candidate/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public WebRTCMessage sendCandidate(@DestinationVariable String roomId,@Payload WebRTCMessage message) {
        return message;
    }
}
