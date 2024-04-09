package com.webapp.intelligentworkspace.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id")
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String numberPhone;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="storageId", referencedColumnName = "id")
    @JsonManagedReference
    @JsonIgnore
    private Storage storage;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="binId",referencedColumnName = "id")
    @JsonManagedReference
    @JsonIgnore
    private Bin bin;

    private Long resetCode;

    @Override
    public String toString() {
        return "User [id=" + id + ", username=" + username + ", email=" + email + "]";
    }

}
