package com.webapp.intelligentworkspace.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "folders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "is_public", columnDefinition = "false")
    private boolean isPublic;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "storage_id")
    @JsonManagedReference
    @JsonIgnore
    private Storage storage;

    @ManyToOne
    @JoinColumn(name = "parrentFolder_id")
    @JsonManagedReference
    @JsonIgnore
    private Folder parentFolder;

    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL)
    @JsonManagedReference
    @JsonIgnore
    private List<Folder> subFolders;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL)
    @JsonManagedReference
    @JsonIgnore
    private Set<File> files = new HashSet<>();

    // Removed the @ManyToMany relationship with File

    public void addSubFolder(Folder folder) {
        if (subFolders == null) {
            subFolders = new ArrayList<>();
            subFolders.add(folder);
        } else {
            subFolders.add(folder);
        }
    }

    @Override
    public String toString() {
        return "Folder{" +
                "id=" + id +
                ", isPublic=" + isPublic +
                ", name='" + name + '\'' +
                '}';
    }

    public void addFile(File fileEntity) {
        if (files == null) {
            files = new HashSet<>();
            files.add(fileEntity);
        } else {
            files.add(fileEntity);
        }
    }
}