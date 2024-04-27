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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class BlobStorageService {

    @Autowired
    BlobServiceClient blobServiceClient;

    public String upload(MultipartFile file, Integer userId) {
        BlobContainerClient containerClient =getContainer(userId);

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

    public byte[]  getFile(String filename,Integer userId){
        BlobContainerClient blobContainerClient= blobServiceClient.getBlobContainerClient(userId.toString());
        System.out.println(filename);
        BlobClient blobClient= blobContainerClient.getBlobClient(filename);
        ByteArrayOutputStream outputStream= new ByteArrayOutputStream();
        blobClient.downloadStream(outputStream);
        final byte[] bytes=outputStream.toByteArray();
        return bytes;
    }


    public ByteArrayOutputStream download(Integer userId, String fileName) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(userId.toString());
        BlobClient blobClient = containerClient.getBlobClient(fileName);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        blobClient.download(os);


        return os;
    }

    public BlobContainerClient getContainer(Integer userId) {
        BlobContainerClient blobContainerClient= blobServiceClient.getBlobContainerClient(userId.toString());

        if(blobContainerClient.exists()){
            return  blobContainerClient;
        }else {
            blobServiceClient.createBlobContainer(userId.toString());
            return  blobServiceClient.getBlobContainerClient(userId.toString());
        }
    }

    public void deleteContainer(String userId) {

        blobServiceClient.deleteBlobContainer(userId);
    }

}
