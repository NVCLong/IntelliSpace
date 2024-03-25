package com.webapp.intelligentworkspace.model.response;

import com.webapp.intelligentworkspace.model.entity.Folder;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder

public class FolderResponse {
    private String name;
    private Long storage_id;
    private List<Folder> subFolders;
    private String status;
    private String message;

    public FolderResponse(String name, Long storage_id, List<Folder> subFolders, String status, String message) {
        this.name = name;
        this.storage_id= storage_id;
        this.subFolders = subFolders;
        this.status = status;
        this.message = message;
    }
}
