package com.webapp.intelligentworkspace.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "storages")
@Getter
@Setter
public class Storage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "maxStorage")
    private final float maxStorage=1;
    @Column(name = "currentStorage")
    private float currentStorage;

    @OneToOne(mappedBy = "storage")
    @JsonManagedReference
    @JsonIgnore
    private User user;

    @Override
    public String toString() {
        return "Storage{" +
                "id=" + id +
                ", maxStorage=" + maxStorage +
                ", currentStorage=" + currentStorage +
                '}';
    }



}
