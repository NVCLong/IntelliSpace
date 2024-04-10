package com.webapp.intelligentworkspace.model.response;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data

public class OtpResponse {

    private String message;
    private boolean status;

    public OtpResponse(String message, boolean status) {
        this.message= message;
        this.status=status;
    }
}
