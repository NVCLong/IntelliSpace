package com.webapp.intelligentworkspace.model.request;


import lombok.Data;

@Data
public class RTCAnswer {
    private String sdp;
    private String type;
}
