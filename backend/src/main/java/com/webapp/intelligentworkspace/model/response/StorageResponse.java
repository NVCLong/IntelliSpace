package com.webapp.intelligentworkspace.model.response;

import com.webapp.intelligentworkspace.model.entity.Storage;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StorageResponse {
    private Storage storage;
    private String message;
    private boolean status;

    public StorageResponse(Storage storage, String message, boolean status) {
        this.storage = storage;
        this.message = message;
        this.status = status;
    }
}
