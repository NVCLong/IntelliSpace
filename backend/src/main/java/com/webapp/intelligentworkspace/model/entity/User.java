package com.webapp.intelligentworkspace.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String numberPhone;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="storageId", referencedColumnName = "id")
    private Storage storage;


}
