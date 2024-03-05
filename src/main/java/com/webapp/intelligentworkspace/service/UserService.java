package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.AuthResponse;
import com.webapp.intelligentworkspace.model.User;
import com.webapp.intelligentworkspace.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Data
public class UserService {
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    UserRepository userRepository;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse createUser(User user){
        System.out.println("Register");
        if(userRepository.findUserById(user.getId()).orElse(null)== null){
            return  new AuthResponse("User has been registered");
        }else {
            User newUser = new User();
            newUser.setUsername(user.getUsername());
            newUser.setPassword(passwordEncoder.encode(user.getPassword()));
            newUser.setEmail(user.getEmail());
            newUser.setNumberPhone(user.getNumberPhone());
            userRepository.save(newUser);
            return new AuthResponse("Created successfully with the username "+ newUser.getUsername());
        }
    }
}
