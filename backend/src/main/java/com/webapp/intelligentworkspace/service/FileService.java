package com.webapp.intelligentworkspace.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.webapp.intelligentworkspace.model.entity.File;
import com.webapp.intelligentworkspace.model.entity.Folder;
import com.webapp.intelligentworkspace.model.entity.User;
import com.webapp.intelligentworkspace.repository.FileRepository;
import com.webapp.intelligentworkspace.repository.FolderRepository;
import com.webapp.intelligentworkspace.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    private final BlobServiceClient blobServiceClient;
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    public FileService(BlobServiceClient blobServiceClient, FileRepository fileRepository, FolderRepository folderRepository, UserRepository userRepository, StorageService storageService) {
        this.blobServiceClient = blobServiceClient;
        this.fileRepository = fileRepository;
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
    }

    public String uploadFile(MultipartFile file, String userId, Long folderId) {
        User user = userRepository.findUserById(Integer.parseInt(userId)).orElseThrow(() -> new RuntimeException("User not found"));
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(user.getUsername());
        BlobClient blobClient = containerClient.getBlobClient(file.getOriginalFilename());

        try {
            blobClient.upload(file.getInputStream(), file.getSize());
            File fileEntity = new File();
            fileEntity.setFile_name(file.getOriginalFilename());
            fileEntity.setFile_url(blobClient.getBlobUrl());
            fileEntity.setSize(file.getSize());
            fileEntity.getFolder().add(folder);
            fileRepository.save(fileEntity);

            folder.getFiles().add(fileEntity);
            folderRepository.save(folder);

            storageService.updateCapacity(user.getStorage().getId(), file.getSize());

            return "Uploaded Successfully, file saved in the database";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to upload file";
        }


    }
}
