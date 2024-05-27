package com.webapp.intelligentworkspace.model.request;


import lombok.Data;

@Data
public class RTCIceCandidate {
    private String candidate;
    private String sdpMid;  // Optional
    private int sdpMLineIndex; // Optional
    private String usernameFragment; // Optional
}