package com.webapp.intelligentworkspace.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    private MessageType type;
    private Integer userid;
    private String content;
    private String sender;
    private String roomId;
    private String peerId;

}
