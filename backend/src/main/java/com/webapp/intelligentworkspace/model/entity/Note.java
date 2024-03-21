package com.webapp.intelligentworkspace.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Note {
    @Id
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;
}
