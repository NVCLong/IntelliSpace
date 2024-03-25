package com.webapp.intelligentworkspace.model.response;

import com.webapp.intelligentworkspace.model.entity.Folder;
import lombok.Builder;

import java.util.List;

@Builder

public class FolderResponse {
    private Folder folder;
    private List<Folder> subFolders;
    private String status;
    private String message;
}
