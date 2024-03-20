package com.webapp.intelligentworkspace.model;

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
    private float maxStorage=1;
    @Column(name = "currentStorage")
    private float currentStorage;

    @OneToOne(mappedBy = "storage")
    private User user;
}
