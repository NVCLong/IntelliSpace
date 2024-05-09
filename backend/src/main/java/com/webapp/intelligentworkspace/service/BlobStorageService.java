package com.webapp.intelligentworkspace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class BlobStorageService {

    @Autowired
    BlobServiceClient blobServiceClient;

    public String upload(MultipartFile file, Long storageId, Integer userId) {
        BlobContainerClient containerClient = getContainer(userId.longValue());

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

    public String delete(String storageId, String fileName) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(storageId);
        BlobClient blobClient = containerClient.getBlobClient(fileName);
        blobClient.delete();
        return "Deleted Successfully";
    }

    public byte[] getFile(String filename, Long storageId) {
        BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(storageId.toString());
        System.out.println(filename);
        BlobClient blobClient = blobContainerClient.getBlobClient(filename);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        blobClient.downloadStream(outputStream);
        final byte[] bytes = outputStream.toByteArray();
        return bytes;
    }


    public ByteArrayOutputStream download(Long storageId, String fileName) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(storageId.toString());
        BlobClient blobClient = containerClient.getBlobClient(fileName);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        blobClient.download(os);

        return os;
    }

    public BlobContainerClient getContainer(Long storageId) {
        BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(storageId.toString());

        if (blobContainerClient.exists()) {
            return blobContainerClient;
        } else {
            blobServiceClient.createBlobContainer(storageId.toString());
            return blobServiceClient.getBlobContainerClient(storageId.toString());
        }
    }

    public void deleteContainer(Long storageId) {

        blobServiceClient.deleteBlobContainer(String.valueOf(storageId));
    }

}
