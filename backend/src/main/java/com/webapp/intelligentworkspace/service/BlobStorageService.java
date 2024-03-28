package com.webapp.intelligentworkspace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class BlobStorageService {


    private final String connectionString = "";
    private final String containerName = "";
    @Autowired
    BlobServiceClient blobServiceClient;

    public String upload(MultipartFile file) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);

        try (InputStream inputStream = file.getInputStream()) {
            BlobClient blobClient = containerClient.getBlobClient(file.getOriginalFilename());
            blobClient.upload(inputStream, file.getSize());
            return "File uploaded successfully";

        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to upload file";
        }

    }

    public void createContainer(String userId) {

        String generalFilesContainerName = userId + "-general-files";
        blobServiceClient.createBlobContainer(generalFilesContainerName);

        String imagesContainerName = userId + "-images";
        blobServiceClient.createBlobContainer(imagesContainerName);
    }

    public void deleteContainer(String userId) {

        String generalFilesContainerName = userId + "-general-files";
        blobServiceClient.deleteBlobContainer(generalFilesContainerName);

        String imagesContainerName = userId + "-images";
        blobServiceClient.deleteBlobContainer(imagesContainerName);
    }

    public void createFolderInContainer(String userId, String folderName) {

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId + "-general-files");

        BlobClient blobClient = containerClient.getBlobClient(folderName + "/New Folder");

        try (InputStream dummyStream = new ByteArrayInputStream(new byte[0])) {
            blobClient.upload(dummyStream, 0);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void deleteFolderInContainer(String userId, String folderName) {

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId + "-general-files");

        containerClient.listBlobs().stream()
                .filter(blobItem -> blobItem.getName().startsWith(folderName))
                .forEach(blobItem -> containerClient.getBlobClient(blobItem.getName()).delete());
    }

    public void listFilesInFolder(String userId, String folderName) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId + "-general-files");

        containerClient.listBlobs().stream()
                .filter(blobItem -> blobItem.getName().startsWith(folderName))
                .forEach(blobItem -> System.out.println(blobItem.getName()));
    }
}
