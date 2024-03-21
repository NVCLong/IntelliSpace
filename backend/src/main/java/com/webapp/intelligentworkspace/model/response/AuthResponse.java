package com.webapp.intelligentworkspace.model.response;

import lombok.Data;

@Data
public class AuthResponse {
    private String content;
    private String refreshToken;
    private String accessToken;

    public AuthResponse(String content) {
        this.content = content;
    }

    public AuthResponse(String content, String accessToken, String refreshToken) {
        this.content = content;
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
    }
}
