package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.AuthResponse;
import com.webapp.intelligentworkspace.model.User;
import com.webapp.intelligentworkspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

public class AuthController {
    @Autowired
    UserService userService;

    @PostMapping("/auth/register")
    @ResponseBody
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        System.out.println(user);
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PostMapping("/auth/login")
    @ResponseBody
    public ResponseEntity<AuthResponse> login(@RequestBody User user) {
        System.out.println(user);
        return ResponseEntity.ok(userService.login(user));
    }

    @PostMapping("/auth/refreshAccessToken")
    @ResponseBody
    public ResponseEntity<AuthResponse> refreshAccessToken(@RequestBody User user, String refreshToken) {
        return ResponseEntity.ok(userService.refreshAccessToken(refreshToken, user));
    }

    //    @PostMapping("auth/logout")
//    @ResponseBody
//    public ResponseEntity<AuthResponse> logout(@Re)

}
