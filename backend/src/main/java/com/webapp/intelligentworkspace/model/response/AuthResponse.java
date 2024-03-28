package com.webapp.intelligentworkspace.model.response;

import com.webapp.intelligentworkspace.model.entity.User;
import lombok.Data;

@Data
public class AuthResponse {
    private String content;
    private String refreshToken;
    private String accessToken;
    private User user;
    private Long storageId;

    public AuthResponse(String content) {
        this.content = content;
    }

    public AuthResponse(String content, String accessToken, String refreshToken) {
        this.content = content;
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
    }
    public AuthResponse(String content, String accessToken, String refreshToken, User user, Long storageId){
        this.content = content;
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
        this.user = user;
        this.storageId= storageId;
    }
}
