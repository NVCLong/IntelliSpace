package com.webapp.intelligentworkspace.service;

import com.azure.storage.blob.specialized.BlobInputStream;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.InputStreamResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;

import java.io.IOException;
import java.io.InputStream;

@Service
public class BlobStorageService {

    @Autowired
    BlobServiceClient blobServiceClient;

    public String upload(MultipartFile file, String userId) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId);

        try (InputStream inputStream = file.getInputStream()) {
            BlobClient blobClient = containerClient.getBlobClient(file.getOriginalFilename());
            blobClient.upload(inputStream, file.getSize());
//            String fileUrl = blobClient.getBlobUrl();
            return null;

        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to upload file";
        }

    }

    public String delete(String userId, String fileName) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId);
        BlobClient blobClient = containerClient.getBlobClient(fileName);
        blobClient.delete();
        return "Deleted Successfully";
    }


    public ResponseEntity<InputStreamResource> download(String userId, String fileName) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId);
        BlobClient blobClient = containerClient.getBlobClient(fileName);
        BlobInputStream blobIS = blobClient.openInputStream();
        InputStreamResource resource = new InputStreamResource(blobIS);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName)
                .body(resource);
    }

    public void createContainer(String userId) {

        blobServiceClient.createBlobContainer(userId);
    }

    public void deleteContainer(String userId) {

        blobServiceClient.deleteBlobContainer(userId);
    }

}
