package com.webapp.intelligentworkspace.model.request;

import lombok.Data;

@Data
public class WebRTCMessage {
    private String type;
    private RTCOffer offer;
    private RTCAnswer answer;
    private RTCIceCandidate candidate;
}
