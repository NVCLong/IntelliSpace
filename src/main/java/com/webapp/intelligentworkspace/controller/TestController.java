package com.webapp.intelligentworkspace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/test")
    public ResponseEntity<String> testApi(){
        return ResponseEntity.ok("Hello successfully");
    }
}
