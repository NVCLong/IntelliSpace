package com.webapp.intelligentworkspace.model.request;

import lombok.Data;

@Data

public class OTPRequest {
    private Long otp;
    private String email;

}
