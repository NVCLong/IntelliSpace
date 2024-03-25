package com.webapp.intelligentworkspace.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Entity
@Table(name="folders")
@Data
public class Folder {

    @Id
    @Column(name = "id")
    private Long id;
    @Column(name="isPublic", columnDefinition = "false")
    private  boolean isPublic;
    @Column(name="name")
    private  String name;

    @ManyToOne
    @JoinColumn(name="storage_id")
    @JsonManagedReference
    @JsonIgnore
    private Storage storage;

    @ManyToOne
    @JoinColumn(name = "parrentFolder_id")
    private Folder parentFolder;

    @OneToMany(mappedBy="parentFolder", cascade = CascadeType.ALL)
    private List<Folder> subFolders;

}
