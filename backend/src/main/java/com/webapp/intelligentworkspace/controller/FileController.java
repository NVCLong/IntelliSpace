package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.entity.File;
import com.webapp.intelligentworkspace.service.FileService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping(value = "/upload/{userId}/{folderId}", produces = "multipart/form-data")
    public String uploadFileToFolder(@RequestParam("file") MultipartFile file, @PathVariable("userId") String userId, @PathVariable("folderId") Long folderId) {
        return fileService.uploadFile(file, userId, folderId);
    }

    @DeleteMapping(value = "/delete/{fileId}", produces = "application/json")
    public String deleteFile(@PathVariable("fileId") Long fileId) {
        return fileService.deleteFile(fileId);
    }

    @GetMapping(value = "/list/{folderId}", produces = "application/json")
    public List<File> listFiles(@PathVariable("folderId") Long folderId) {
        return fileService.listFilesInFolder(folderId);
    }

    @PutMapping(value = "/rename/{fileId}/{newFileName}", produces = "application/json")
    public String renameFile(@PathVariable("fileId") Long fileId, @PathVariable String newFileName) {
        return fileService.renameFile(fileId, newFileName);
    }
}
