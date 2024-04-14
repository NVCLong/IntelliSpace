package com.webapp.intelligentworkspace.service;

import com.azure.storage.blob.BlobServiceClient;
import com.webapp.intelligentworkspace.model.entity.File;
import com.webapp.intelligentworkspace.model.entity.Folder;
import com.webapp.intelligentworkspace.model.entity.Storage;
import com.webapp.intelligentworkspace.model.entity.User;
import com.webapp.intelligentworkspace.repository.FileRepository;
import com.webapp.intelligentworkspace.repository.FolderRepository;
import com.webapp.intelligentworkspace.repository.StorageRepository;
import com.webapp.intelligentworkspace.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class FileService {

    private final BlobServiceClient blobServiceClient;
    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final StorageRepository storageRepository;
    private final StorageService storageService;
    private final BlobStorageService blobStorageService;

    public FileService(BlobServiceClient blobServiceClient, FileRepository fileRepository, FolderRepository folderRepository, UserRepository userRepository, StorageRepository storageRepository, StorageService storageService, BlobStorageService blobStorageService) {
        this.blobServiceClient = blobServiceClient;
        this.fileRepository = fileRepository;
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
        this.storageRepository = storageRepository;
        this.storageService = storageService;
        this.blobStorageService = blobStorageService;
    }

    public String uploadFile(MultipartFile file, Long storageId, Long folderId, Integer userId) {
        try {
            Storage storage = storageRepository.findById(storageId).orElseThrow(() -> new RuntimeException("User not found"));
            Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

            // Use the BlobStorageService's upload method
            String uploadResult = blobStorageService.upload(file, userId);
            if (uploadResult != null) {
                return uploadResult;
            }

            File fileEntity = new File();

            fileEntity.setFile_name(file.getOriginalFilename());
            fileEntity.setFile_url(blobServiceClient.getBlobContainerClient(userId.toString()).getBlobClient(file.getOriginalFilename()).getBlobUrl());
            fileEntity.setSize(file.getSize());
            fileEntity.setFolder(folder);
            fileEntity.setStorage(storage);

            fileRepository.save(fileEntity);

            folder.addFile(fileEntity);
            folderRepository.save(folder);

//            storageService.updateCapacity(user.getStorage().getId(), file.getSize());

            return "Uploaded Successfully, file saved in the database";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to upload file";
        }
    }

    public String deleteFile(Long fileId, Integer userId) {
        try {
            File file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
            blobStorageService.delete(userId.toString(), file.getFile_name());
            fileRepository.delete(file);
            return "Deleted Successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to delete file";
        }
    }

    public List<File> listFilesInFolder(Long folderId) {
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));
        return new ArrayList<>(folder.getFiles());
    }

    public String renameFile(Long fileId, String newFileName) {
        try {
            File file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
            file.setFile_name(newFileName);
            fileRepository.save(file);
            return "Renamed Successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to rename file";
        }
    }

}

