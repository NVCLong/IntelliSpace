package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.entity.Storage;
import com.webapp.intelligentworkspace.model.response.StorageResponse;
import com.webapp.intelligentworkspace.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/storage")
public class StorageController {
    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/currentCapacity")
    public ResponseEntity<StorageResponse> currentCapacity(@RequestParam Long storageId) {
        return ResponseEntity.ok(storageService.getCurrentStorage(storageId));
    }
}
