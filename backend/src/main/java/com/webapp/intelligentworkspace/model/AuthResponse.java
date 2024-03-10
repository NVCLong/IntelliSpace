package com.webapp.intelligentworkspace.model;

import lombok.Data;

@Data
public class AuthResponse {
    private String content;
    private String refreshToken;
    private String accessToken;

    public AuthResponse(String content) {
        this.content = content;
    }

    public AuthResponse(String content, String refreshToken, String accessToken) {
        this.content = content;
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
    }
}
