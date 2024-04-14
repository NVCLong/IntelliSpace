package com.webapp.intelligentworkspace.controller;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.webapp.intelligentworkspace.service.BlobStorageService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/blob")
public class BlobStorageController {

    private final BlobStorageService blobStorageService;

    public BlobStorageController(BlobStorageService blobStorageService) {
        this.blobStorageService = blobStorageService;
    }

    @PostMapping(value = "/upload/{userId}/{storageId}")
    public String uploadFile(@RequestParam("file") MultipartFile file, @PathVariable("userId") Integer userId) {
        return blobStorageService.upload(file, userId);
    }

    @GetMapping(value = "/download/{userId}/{fileName}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable("userId") String userId, @PathVariable("fileName") String fileName) {
        return blobStorageService.download(userId, fileName);
    }

    @DeleteMapping(value = "/delete/{userId}/{fileName}")
    public String delete(@PathVariable("userId") String userId, @PathVariable("fileName") String fileName) {
        return blobStorageService.delete(userId, fileName);
    }


    @PostMapping(value = "/deleteContainer")
    public void deleteContainer(@RequestParam("userId") String userId) {
        blobStorageService.deleteContainer(userId);
    }

}
