package com.webapp.intelligentworkspace.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

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
