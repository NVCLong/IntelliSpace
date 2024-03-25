package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.entity.Folder;
import com.webapp.intelligentworkspace.model.entity.Storage;
import com.webapp.intelligentworkspace.model.response.FolderResponse;
import com.webapp.intelligentworkspace.model.response.RootFolderResponse;
import com.webapp.intelligentworkspace.repository.FolderRepository;
import com.webapp.intelligentworkspace.repository.StorageRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Data
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;
    @Autowired
    private StorageRepository storageRepository;


    // find all rootFolder with storage id and parent folder id
    public RootFolderResponse getRootFolders(Long storageId){
        List<Folder> rootFolderList = folderRepository.findAllRootFolderById(storageId);
        if(rootFolderList.isEmpty()){
            return RootFolderResponse.builder()
                    .rootFolders(null)
                    .message("User haven't created any folders")
                    .status("Not found any root folders")
                    .build();
        }else {
            return RootFolderResponse.builder()
                    .rootFolders(rootFolderList)
                    .message("All root Folder of the user")
                    .status("OK")
                    .build();
        }
    }

    // find folder and it's sub folders
    public FolderResponse getSubFolderById(Long folderId) {
        Folder folder=folderRepository.findById(folderId).orElse(null);
        if(folder==null){
            return FolderResponse.builder()
                    .folder(null)
                    .subFolders(null)
                    .status("Failed to find folder")
                    .message("Can not find the folder with the given id")
                    .build();
        }else {
            List<Folder> subFolders = folderRepository.findAllByParentFolderId(folderId);
            return FolderResponse.builder()
                    .folder(folder)
                    .subFolders(subFolders)
                    .message("Success to find the folder")
                    .status("Success")
                    .build();
        }
    }

    public FolderResponse createFolder(Folder folder, Long parentId, Long storageId){
        Folder parentFolder= folderRepository.findById(parentId).orElse(null);
        Storage storage= storageRepository.findById(storageId).orElse(null);
        if(parentFolder == null){
            return FolderResponse.builder()
                    .status("Fail")
                    .message("Can not find root folder")
                    .folder(null)
                    .build();
        }else{
            if(storage==null){
                return FolderResponse.builder()
                        .folder(null)
                        .message(" can not get the storage")
                        .status(" Failed")
                        .subFolders(null)
                        .build();
            }else {
                folder.setParentFolder(parentFolder);
                folder.setStorage(storage);

                folderRepository.save(folder);

                return FolderResponse.builder()
                        .folder(folder)
                        .message("created successfully")
                        .status("Success")
                        .build();

            }
        }
    }

    public FolderResponse createRootFolder(Folder folder, Long storageId){
        Storage storage= storageRepository.findById(storageId).orElse(null);
        if(storage==null){
            return FolderResponse.builder()
                    .folder(null)
                    .message(" can not get the storage")
                    .status(" Failed")
                    .subFolders(null)
                    .build();
        }else{
            return FolderResponse.builder()
                    .folder(folder)
                    .status(" Success")
                    .subFolders(null)
                    .message("Created success folder")
                    .build();
        }

    }

}
