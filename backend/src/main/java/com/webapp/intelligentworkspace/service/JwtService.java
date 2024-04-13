package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.entity.Token;
import com.webapp.intelligentworkspace.model.entity.User;
import com.webapp.intelligentworkspace.repository.TokenRepository;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service

public class JwtService {
    private final String secretKey="f241085f6e34a99c4da1501d55025d8a7d06b1eaababb3531220aff24c211693";
    private TokenRepository tokenRepository;


    public JwtService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // get all claims in the token
    public <T> T extractClaim(String token, Function<Claims, T> resolver){
        Claims claims= extractAllClaims(token);
        return resolver.apply(claims);
    }

    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSignKeys())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // check the token is Valid
    public boolean isValid(String token, UserDetails user){
        String username= extractUsername( token);
        return username.equals(user.getUsername())&!isExpired(token);
    }


    // check the expiration date
    // before = true,  expired
    // before = false, not expired


    public boolean isExpired(String token){
        Date expiration= getExpiration(token);
        return expiration.before(new Date());
    }

    //get the expiration in the token
    public Date getExpiration(String token){
        return extractClaim(token,Claims::getExpiration);
    }

    // get username in the token

    public String extractUsername(String token){
        return  extractClaim(token,Claims::getSubject);
    }

    //get userId in the token
    public String extractUserId(String token){
        return  extractClaim(token,Claims::getId);
    }


    //generate the refresh Token
    public String generateRefreshToken(User user){
        String token= Jwts.builder()
                .subject(user.getUsername())
                .id(user.getId().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+ 2*60*60*1000))
                .signWith(getSignKeys())
                .compact();
        return token;
    }

    //generate the access Token
    public String generateAccessToken(User user){
        return  Jwts.builder()
                .subject(user.getUsername())
                .id(user.getId().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+ 60*1000))
                .signWith(getSignKeys())
                .compact();
    }


    public String refreshAccessToken(String refreshToken, User user){
        if(!isExpired(refreshToken)){
            return generateAccessToken(user);
        }else return null;
    }

    public SecretKey getSignKeys(){
        byte[] signature = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(signature);
    }



}
