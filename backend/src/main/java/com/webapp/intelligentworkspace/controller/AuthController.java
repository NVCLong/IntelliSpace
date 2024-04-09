package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.response.AuthResponse;
import com.webapp.intelligentworkspace.model.entity.User;
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

    @PostMapping(value = "/auth/login", produces = "application/json")
    @ResponseBody
    public ResponseEntity<AuthResponse> login(@RequestBody User user) {
        System.out.println(user);
        return ResponseEntity.ok(userService.login(user));
    }

    @GetMapping("/auth/oauth2/login")
    @ResponseBody
    public ResponseEntity<AuthResponse> signInWithOauth2(@RequestParam("name") String name, @RequestParam("email") String email ){
        System.out.println("Login with oauth2");
        return ResponseEntity.ok(userService.loginWithOauth(email,name));
    }

    @GetMapping("/auth/logout/{userId}")
    @ResponseBody
    public ResponseEntity<String> logout(@PathVariable("userId") Integer userId){
        userService.logOut(userId);
        return ResponseEntity.ok("Log out Successfully");
    }

    @GetMapping("/auth/newAccessToken")
    @ResponseBody
    public ResponseEntity<AuthResponse> newAccessToken(@RequestParam("userId") Integer userId, @CookieValue(name = "refreshToken") String refreshToken){
        System.out.println("Start re-generate");
        System.out.println("refreshToken "+refreshToken);
        return  ResponseEntity.ok(userService.refreshAccessToken(refreshToken, userId));
    }

    @PostMapping(value="/auth/resetPassword", produces = "application/json")
    @ResponseBody
    public ResponseEntity<String> sendMailResetCode(@RequestBody User user){
        System.out.println("Sending code to email");
        userService.sendEmail(user.getEmail());
        return ResponseEntity.ok("Send success");
    }
}
