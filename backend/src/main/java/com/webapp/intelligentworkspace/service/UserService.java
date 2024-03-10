package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.AuthResponse;
import com.webapp.intelligentworkspace.model.User;
import com.webapp.intelligentworkspace.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@Data
public class UserService {
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse createUser(User user){
        System.out.println("Register");
        if(userRepository.findUserByUsername(user.getUsername()).orElse(null)!= null){
            return  new AuthResponse("User has been registered");
        }else {
            User newUser = new User();
            Random random = new Random();
            newUser.setId(random.nextInt(0,100000000));
            newUser.setUsername(user.getUsername());
            newUser.setPassword(passwordEncoder.encode(user.getPassword()));
            newUser.setEmail(user.getEmail());
            newUser.setNumberPhone(user.getNumberPhone());
            userRepository.save(newUser);
            return new AuthResponse("Created successfully with the username "+ newUser.getUsername());
        }
    }

    public AuthResponse login(User user){
        System.out.println("Login phase started");
        if(userRepository.findUserByUsername(user.getUsername()).isEmpty()){
            return new AuthResponse("Do not register with this user name");
        }else {
            try {
                System.out.println("running");
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                user.getPassword()
                        )
                );
                User user1= userRepository.findUserByUsername(user.getUsername()).orElse(null);
                System.out.println(user1);
                if(user1 != null) {
                    String accessToken = jwtService.generateAccessToken(user1);
                    String refreshToken = jwtService.generateRefreshToken(user1);
                    return new AuthResponse("Login successfully", accessToken, refreshToken);
                }
                else {
                    return  new AuthResponse("Login failed");
                }
            }catch (Exception e) {
                System.out.println("error");
                System.out.println(e);
            }

            return new AuthResponse("Wrong password");
        }
    }
    public AuthResponse refreshAccessToken(String refreshToken, User user) {
        String token=jwtService.refreshAccessToken(refreshToken, user);
        return new AuthResponse("This is new accessToken",null, token);
    }
}
