package com.webapp.intelligentworkspace.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="folders")
@Data
public class Folder {

    @Id
    @Column(name = "id")
    private Long id;
    @Column(name="is_public", columnDefinition = "false")
    private  boolean isPublic;
    @Column(name="name")
    private  String name;

    @ManyToOne
    @JoinColumn(name="storage_id")
    @JsonManagedReference
    @JsonIgnore
    private Storage storage;

    @ManyToOne
    @JoinColumn(name = "parrent_folder_id")
    @JsonManagedReference
    @JsonIgnore
    private Folder parentFolder;

    @OneToMany(mappedBy="parentFolder", cascade = CascadeType.ALL)
    @JsonManagedReference
    @JsonIgnore
    private List<Folder> subFolders;

    @ManyToMany(mappedBy = "folder")
    private Set<File> files;

    @ManyToMany
    @JoinTable(
            name = "files",
            joinColumns = @JoinColumn(name = "id"),
            inverseJoinColumns = @JoinColumn(name = "id"))

    // many many
    // spring open ai
    // files






    public void addSubFolder(Folder folder) {
        if(subFolders==null){
            subFolders= new ArrayList<>();
            subFolders.add(folder);
        }else {
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
}
