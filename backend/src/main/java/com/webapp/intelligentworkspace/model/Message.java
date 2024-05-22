package com.webapp.intelligentworkspace.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {
    private String sender;
    private String content;
    private String roomId;

}
