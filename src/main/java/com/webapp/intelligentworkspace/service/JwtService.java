package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.User;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.util.Date;

@Service

public class JwtService {
    private final String secretKey="f241085f6e34a99c4da1501d55025d8a7d06b1eaababb3531220aff24c211693";



    private String generateToken(User user){
        String token= Jwts.builder()
                .subject(user.getUsername())
                .id(user.getId().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+ 24*60*60*1000))
                .signWith(getSignKeys())
                .compact();
        return token;
    }

    private SecretKey getSignKeys(){
        byte[] signature = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(signature);
    }



}
