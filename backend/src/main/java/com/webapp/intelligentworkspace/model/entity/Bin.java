package com.webapp.intelligentworkspace.model.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

@Data
@Entity
public class Bin {
    @Id
    @Column(name="id")
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "bin")
    @JsonManagedReference
    @JsonIgnore
    private User user;

    public Bin() {

    }




}
