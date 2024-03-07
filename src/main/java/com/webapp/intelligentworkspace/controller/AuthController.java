package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.AuthResponse;
import com.webapp.intelligentworkspace.model.User;
import com.webapp.intelligentworkspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class AuthController {
    @Autowired
    UserService userService;

    @PostMapping("/auth/register")
    @ResponseBody
    public ResponseEntity<AuthResponse> register(@RequestBody User user){
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PostMapping("/auth/login")
    @ResponseBody
    public ResponseEntity<AuthResponse> login(@RequestBody User user){
        System.out.println(user);
        return ResponseEntity.ok(userService.login(user));
    }

}
