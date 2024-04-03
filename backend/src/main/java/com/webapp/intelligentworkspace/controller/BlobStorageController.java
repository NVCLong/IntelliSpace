package com.webapp.intelligentworkspace.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.webapp.intelligentworkspace.service.BlobStorageService;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class BlobStorageController {

    private final BlobStorageService blobStorageService;

    public BlobStorageController(BlobStorageService blobStorageService) {
        this.blobStorageService = blobStorageService;
    }

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("userId") String userId) {
        return blobStorageService.upload(file, userId);
    }

    @PostMapping("/delete")
    public String deleteFile(@RequestParam("userId") String userId, @RequestParam("fileName") String fileName) {
        return blobStorageService.delete(userId, fileName);
    }

    @PostMapping("/createContainer")
    public void createContainer(@RequestParam("userId") String userId) {
        blobStorageService.createContainer(userId);
    }

    @PostMapping("/deleteContainer")
    public void deleteContainer(@RequestParam("userId") String userId) {
        blobStorageService.deleteContainer(userId);
    }

    @PostMapping("/createFolder")
    public void createFolderInContainer(@RequestParam("userId") String userId, @RequestParam("folderName") String folderName) {
        blobStorageService.createFolderInContainer(userId, folderName);
    }

    @PostMapping("/deleteFolder")
    public void deleteFolderInContainer(@RequestParam("userId") String userId, @RequestParam("folderName") String folderName) {
        blobStorageService.deleteFolderInContainer(userId, folderName);
    }

    @PostMapping("/listFiles")
    public void listFiles(@RequestParam("userId") String userId, @RequestParam("folderName") String folderName) {
        blobStorageService.listFilesInFolder(userId);
    }

}
