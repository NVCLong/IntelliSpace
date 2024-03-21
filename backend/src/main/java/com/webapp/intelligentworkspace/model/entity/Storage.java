package com.webapp.intelligentworkspace.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "storages")
@Data
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
    private User user;
}
