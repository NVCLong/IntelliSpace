package com.webapp.intelligentworkspace.controller;


import com.webapp.intelligentworkspace.model.request.CallRequest;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;

@RestController
public class MessageController {

    ArrayList<CallRequest> callRequests = new ArrayList<>();

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/addUser")
    public void addUser(@Payload CallRequest callRequest) {
        System.out.println("Adding user to room chat");
        callRequests.add(callRequest);
    }

    @MessageMapping("/offer")
    public void offer(@Payload CallRequest callRequest) {
        System.out.println("Offer came");
        JSONObject jsonObject= new JSONObject();
    }
}
