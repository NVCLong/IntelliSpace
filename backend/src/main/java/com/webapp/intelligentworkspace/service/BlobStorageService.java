package com.webapp.intelligentworkspace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class BlobStorageService {

//    @Autowired
//    JdbcTemplate jdbcTemplate;

    @Autowired
    BlobServiceClient blobServiceClient;

    public String upload(MultipartFile file, String userId) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId);

        try (InputStream inputStream = file.getInputStream()) {
            BlobClient blobClient = containerClient.getBlobClient(file.getOriginalFilename());
            blobClient.upload(inputStream, file.getSize());
//            String fileUrl = blobClient.getBlobUrl();
            return "Uploaded Successfully, here is the link: " + blobClient.getBlobUrl();

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

    public void createContainer(String userId) {

        blobServiceClient.createBlobContainer(userId);
    }

    public void deleteContainer(String userId) {

        blobServiceClient.deleteBlobContainer(userId);
    }

    public void createFolderInContainer(String userId, String folderName) {

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId);

        BlobClient blobClient = containerClient.getBlobClient(folderName + "/New Folder");

        try (InputStream dummyStream = new ByteArrayInputStream(new byte[0])) {
            blobClient.upload(dummyStream, 0);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void deleteFolderInContainer(String userId, String folderName) {

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId);

        containerClient.listBlobs().stream()
                .filter(blobItem -> blobItem.getName().startsWith(folderName))
                .forEach(blobItem -> containerClient.getBlobClient(blobItem.getName()).delete());
    }

    public void listFilesInFolder(String userId) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId);

        containerClient.listBlobs().stream()
                .filter(blobItem -> blobItem.getName().startsWith(userId))
                .forEach(blobItem -> System.out.println(blobItem.getName()));
    }
}
