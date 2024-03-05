package com.webapp.intelligentworkspace.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue
    private Integer id;
    private  String username;
    private  String password;
    private String email;
    private String numberPhone;

}
