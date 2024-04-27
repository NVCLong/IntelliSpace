package com.webapp.intelligentworkspace.controller;

import com.azure.core.annotation.Get;
import com.webapp.intelligentworkspace.model.entity.File;
import com.webapp.intelligentworkspace.service.BlobStorageService;
import com.webapp.intelligentworkspace.service.FileService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import static org.springframework.util.MimeTypeUtils.IMAGE_JPEG_VALUE;
import static org.springframework.util.MimeTypeUtils.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;

    private  final BlobStorageService blobStorageService;

    public FileController(FileService fileService, BlobStorageService blobStorageService) {
        this.fileService = fileService;
        this.blobStorageService = blobStorageService;
    }

    @PostMapping(value = "/upload/{userId}/{folderId}/{storageId}", consumes = "multipart/form-data", produces = "application/json")
    public String uploadFileToFolder(@RequestParam("file") MultipartFile file, @PathVariable("userId") Integer userId, @PathVariable("folderId") Long folderId, @PathVariable("storageId") Long storageId)throws SQLException, IOException {
        return fileService.uploadFile(file, storageId , folderId, userId);
    }

    @GetMapping(value = "/read/{userId}/{filename}", produces ={IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE} )
    public ResponseEntity<byte[]> getPhoto(@PathVariable("filename") String filename, @PathVariable("userId") Integer userId) throws IOException {
        System.out.println(filename);
        return ResponseEntity.ok(blobStorageService.getFile(filename, userId));
    }
//
    @GetMapping("/download/{userId}/{filename}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable("userId") Integer userId, @PathVariable("filename") String filename ){
        System.out.println(filename);
        String contentType = "application/octet-stream";
        String headerValue = "attachment; filename=\"" +filename + "\"";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                .body(blobStorageService.download(userId,filename).toByteArray());
    }

    @DeleteMapping(value = "/delete/{fileId}", produces = "application/json")
    public String deleteFile(@PathVariable("fileId") Long fileId, @RequestParam("userId") Integer userId ) {
        return fileService.deleteFile(fileId, userId);
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
