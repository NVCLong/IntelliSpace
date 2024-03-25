package com.webapp.intelligentworkspace.model.response;

import com.webapp.intelligentworkspace.model.entity.Folder;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
public class RootFolderResponse {
    private List<Folder> rootFolders;
    private String status;
    private String message;
}
