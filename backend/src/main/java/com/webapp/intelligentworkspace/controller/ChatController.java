package com.webapp.intelligentworkspace.controller;
import com.webapp.intelligentworkspace.model.ChatMessage;
import com.webapp.intelligentworkspace.model.request.WebRTCMessage;
import com.webapp.intelligentworkspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class ChatController {

    @Autowired
    private UserService userService;

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public ChatMessage sendMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessage chatMessage
    ) {
        String username = userService.getUsernameById(Integer.parseInt(chatMessage.getSender()));
        chatMessage.setSender(username);
        chatMessage.setRoomId(roomId);
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        Integer userId = (Integer) headerAccessor.getSessionAttributes().get("userId");

        try {
            String username = userService.getUsernameById(userId);

            headerAccessor.getSessionAttributes().put("username", username);
            chatMessage.setSender(username);
        } catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated: " + e.getMessage());
        }

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
