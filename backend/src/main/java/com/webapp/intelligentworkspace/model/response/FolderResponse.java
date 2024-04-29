package com.webapp.intelligentworkspace.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.webapp.intelligentworkspace.model.entity.File;
import com.webapp.intelligentworkspace.model.entity.Folder;
import com.webapp.intelligentworkspace.model.entity.Storage;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder

public class FolderResponse {
    private Storage storage;
    private Folder folder;
    private Folder parentFolder;
    private List<Folder> subFolders;
    private String status;
    private String message;

    private List<File> files;

    public FolderResponse(Storage storage, Folder folder, Folder parentFolder ,List<Folder> subFolders, String status, String message, List<File> files) {
        this.storage= storage;
        this.folder = folder;
        this.parentFolder = parentFolder;
        this.subFolders = subFolders;
        this.status = status;
        this.message = message;
        this.files = files;
    }
}
