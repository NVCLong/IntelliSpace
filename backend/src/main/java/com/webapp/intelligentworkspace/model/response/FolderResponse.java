package com.webapp.intelligentworkspace.model.response;

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
    private List<Folder> subFolders;
    private String status;
    private String message;

    public FolderResponse(Storage storage, Folder folder, List<Folder> subFolders, String status, String message) {
        this.storage= storage;
        this.folder = folder;
        this.subFolders = subFolders;
        this.status = status;
        this.message = message;
    }
}
