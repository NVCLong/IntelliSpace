package com.webapp.intelligentworkspace.controller;

import com.azure.core.annotation.Get;
import com.webapp.intelligentworkspace.model.entity.File;
import com.webapp.intelligentworkspace.service.BlobStorageService;
import com.webapp.intelligentworkspace.service.FileService;
import org.apache.commons.io.FilenameUtils;
import org.apache.tika.detect.DefaultDetector;
import org.apache.tika.detect.Detector;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.List;



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

    @GetMapping(value = "/read/{userId}/{filename}")
    public ResponseEntity<byte[]> getFile(@PathVariable("filename") String filename, @PathVariable("userId") Integer userId, @RequestParam("fileId") Long fileId) throws IOException {
        System.out.println(filename);
        String headerValue = "attachment; filename=\"" +filename + "\"";
        if(filename.contains(".png")){
            return ResponseEntity.status(200)
                    .contentType(MediaType.IMAGE_PNG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(fileService.getFileData(filename, userId,fileId));
        } else if (filename.contains(".jpeg")) {
            return ResponseEntity.status(200)
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(fileService.getFileData(filename, userId,fileId));
        }else if (filename.contains(".txt")) {
            return ResponseEntity.status(200)
                    .contentType(MediaType.TEXT_PLAIN)
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(fileService.getFileData(filename, userId,fileId));
        } else if (filename.contains(".docx")) {
            return ResponseEntity.status(200)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(fileService.getFileData(filename, userId,fileId));
        }else {
            return null;
        }
    }

    @GetMapping(value="/sharedFile/download")
    public ResponseEntity<byte[]> downloadSharedFile(@RequestParam("code") String code, @RequestParam("fileName") String fileName, @RequestParam("fileId") Long fileId) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {
        System.out.println(fileName);
        String headerValue = "attachment; filename=\"" +fileName + "\"";
        if(fileName.contains(".png")){
            return ResponseEntity.status(200)
                    .contentType(MediaType.IMAGE_PNG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(fileService.getSharedFile(code, fileName, fileId));
        } else if (fileName.contains(".jpeg")) {
            return ResponseEntity.status(200)
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(fileService.getSharedFile(code, fileName, fileId));
        }else if (fileName.contains(".txt")) {
            return ResponseEntity.status(200)
                    .contentType(MediaType.TEXT_PLAIN)
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(fileService.getSharedFile(code, fileName, fileId));
        } else if (fileName.contains(".docx")) {
            return ResponseEntity.status(200)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                    .body(fileService.getSharedFile(code, fileName, fileId));
        }else {
            return null;
        }
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

    @DeleteMapping(value = "/delete/{fileId}/{storageId}", produces = "application/json")
    public String deleteFile(@PathVariable("fileId") Long fileId, @RequestParam("userId") Integer userId, @PathVariable("storageId") Long storageId ) {
        System.out.println("running Passing");
        return fileService.deleteFile(fileId, userId, storageId);
    }

    @GetMapping(value = "/list/{folderId}", produces = "application/json")
    public List<File> listFiles(@PathVariable("folderId") Long folderId) {
        return fileService.listFilesInFolder(folderId);
    }

    @PutMapping(value = "/rename/{fileId}/{newFileName}", produces = "application/json")
    public String renameFile(@PathVariable("fileId") Long fileId, @PathVariable String newFileName) {
        return fileService.renameFile(fileId, newFileName);
    }

    @PatchMapping(value = "/softDelete")
    public String moveToTrash(@RequestParam("fileId") Long fileId) {
        fileService.moveToTrash(fileId);
        return "Success";
    }

    @GetMapping("/trash/{storageId}")
    public ResponseEntity<List<File>> getFileFromTrash(@PathVariable("storageId") Long storageId) {
        return ResponseEntity.ok(fileService.getFileInBin(storageId));
    }

}
