package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.entity.User;
import com.webapp.intelligentworkspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserDetailsImp implements UserDetailsService {
    @Autowired
    public UserRepository userRepository;

    public UserDetailsImp(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userList= userRepository.findUserByUsername(username);
        System.out.println(userList);
        if(userList.isEmpty()){
            throw new UsernameNotFoundException("Can not find user by username "+username);
        }
        username= userList.get().getUsername();
        String password= userList.get().getPassword();
        ArrayList<GrantedAuthority> authorityArrayList= new ArrayList<>();
        authorityArrayList.add(new SimpleGrantedAuthority("user"));
        // can improve the admin site by assgin the role admin for special user
        return new org.springframework.security.core.userdetails.User(username,password,authorityArrayList);
    }
}
