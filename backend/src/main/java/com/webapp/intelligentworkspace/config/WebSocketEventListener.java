package com.webapp.intelligentworkspace.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;



@Component
@RequiredArgsConstructor
@Slf4j

//use to log-out all event related to socket
public class WebSocketEventListener  {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(
            SessionDisconnectEvent sessionDisconnectEvent
            ) {
        // TODO -- to be implemented
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionDisconnectEvent event){
        logger.info("Received websocket connection");
    }

}
