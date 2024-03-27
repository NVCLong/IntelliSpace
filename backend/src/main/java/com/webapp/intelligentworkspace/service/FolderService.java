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

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Random;

@Service
@Data
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;
    @Autowired
    private StorageRepository storageRepository;


    // find all rootFolder with storage id and parent folder id
    public RootFolderResponse getRootFolders(Long storageId){
        System.out.println(storageId);
        List<Folder> rootFolderList = folderRepository.findAllRootFolderById(storageId);
        sortFolders(rootFolderList);
        System.out.println(rootFolderList);
        System.out.println(rootFolderList);
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
    public FolderResponse getSubFolderById(Long folderId, Long storageId) {
        Folder folder=folderRepository.findById(folderId).orElse(null);
        Storage storage= storageRepository.findById(storageId).orElse(null);
        if(folder==null){
            return FolderResponse.builder()
                    .folder(null)
                    .storage(storage)
                    .subFolders(null)
                    .status("Failed to find folder")
                    .message("Can not find the folder with the given id")
                    .build();
        }else {
            List<Folder> subFolders = folderRepository.findAllByParentFolderId(folderId);
            sortFolders(subFolders);
            return FolderResponse.builder()
                    .folder(folder)
                    .storage(storage)
                    .subFolders(subFolders)
                    .message("Success to find the folder")
                    .status("Success")
                    .build();
        }
    }

    // Create folder
    public FolderResponse createFolder(Folder folder, Long parentId, Long storageId){
        Folder parentFolder= folderRepository.findById(parentId).orElse(null);
        Storage storage= storageRepository.findById(storageId).orElse(null);
        if(parentFolder == null){
            return FolderResponse.builder()
                    .status("Fail")
                    .storage(storage)
                    .folder(null)
                    .message("Can not find root folder")
                    .build();
        }else{
            if(storage==null){
                return FolderResponse.builder()
                        .folder(null)
                        .storage(null)
                        .message(" can not get the storage")
                        .status(" Failed")
                        .subFolders(null)
                        .build();
            }else {
                Random random= new Random();
                folder.setParentFolder(parentFolder);
                folder.setStorage(storage);
                folder.setId(random.nextLong(1,1000000));
                folderRepository.save(folder);
                parentFolder.addSubFolder(folder);

                return FolderResponse.builder()
                        .folder(folder)
                        .parentFolder(parentFolder)
                        .storage(storage)
                        .message("created successfully")
                        .status("Success")
                        .build();

            }
        }
    }

    public FolderResponse createRootFolder(Folder folder, Long storageId){
        Storage storage= storageRepository.findById(storageId).orElse(null);
        if(storage==null){
            System.out.println("Fail");
            return null;
        }else{
            Random random= new Random();
            System.out.println("running");
            folder.setId(random.nextLong(1,100000000));
            folder.setStorage(storage);
            System.out.println(folder);
            folderRepository.save(folder);
            return  new FolderResponse( storage,folder,null,null,"success","CreateRootFolder success");

        }
    }

    // Patch : update name..... for root folder
    public FolderResponse updateFolder(Long folderId, Long storageId, String folderName){
        Storage storage=storageRepository.findById(storageId).orElse(null);
        if( storage==null ){
            System.out.println("Fail");
            return FolderResponse.builder()
                    .folder(null)
                    .storage(null)
                    .message(" Can not find storage")
                    .status("Fail")
                    .build();
        }else{
            Folder folder1= folderRepository.findById(folderId).orElse(null);
            if(folder1==null){
                return FolderResponse.builder()
                        .folder(null)
                        .storage(storage)
                        .message(" Can not find root folder")
                        .status("Fail")
                        .build();
            }else {
                folder1.setName(folderName);
                folderRepository.save(folder1);
                return FolderResponse.builder()
                        .folder(folder1)
                        .subFolders(folder1.getSubFolders())
                        .status("success")
                        .storage(storage)
                        .message("Successfully")
                        .build();
            }
        }
    }

    // delete folder
    // 1. Check STORAGE
    // + if STORAGE == null then return
    // + if STORAGE != null then check FOLDER
    // 2. Check FOLDER
    // + if FOLDER == null then return
    // + if FOLDER != null then  check FOLDER.PARENT_FOLDER
    // 3. Check PARENT_FOLDER
    // + if PARENT_FOLDER == null then check FOLDER.SUB_FOLDER
    // + if PARENT_FOLDER != null then check PARENT_FOLDER delete FOLDER from its SUB_FOLDER_LIST, after deletion check FOLDER.SUB_FOLDER
    // 4. Check SUB_FOLDER
    // + if SUB_FOLDER == null then delete FOLDER
    // + if SUB_FOLDER != null then SUB_FOLDER : delete all FOLDER in SUB_FOLDER_LIST, after deletion delete FOLDER
    public FolderResponse deleteFolder(Long folderId, Long storageId){
        Storage storage= storageRepository.findById(storageId).orElse(null);
        // Check Storage
        if(storage==null){
            return  FolderResponse.builder()
                    .message("Failed to find storage")
                    .status("fail")
                    .build();
        }else {
            Folder folder= folderRepository.findById(folderId).orElse(null);
            // Check Folder
            if(folder==null){
                return FolderResponse.builder()
                        .storage(storage)
                        .message("Failed to find folder")
                        .status("fail")
                        .build();
            }else {
                Queue<Folder> queue = new LinkedList<>();
                queue.add(folder);
                while (!queue.isEmpty()) {
                    Folder currentFolder = queue.poll();
                    Folder parentFolder = currentFolder.getParentFolder();
                    if(parentFolder!=null){
                        parentFolder.getSubFolders().remove(currentFolder);
                    }
                    List<Folder> subFolderList= folderRepository.findAllByParentFolderId(currentFolder.getId());
                    queue.addAll(subFolderList);
                    folderRepository.delete(currentFolder);
                }
                return FolderResponse.builder()
                        .parentFolder(null)
                        .storage(storage)
                        .message("success to delete folder")
                        .status("success")
                        .build();
            }
        }
    }

    // bubble sorting , maybe can modify and upgrade by using merge sorting
    private void sortFolders(List<Folder> folders) {
        for (int i = 0; i < folders.size(); i++) {
            for (int j = i+1; j <folders.size()-1 ; j++) {
                if(folders.get(i).getName().compareTo(folders.get(j).getName())>0 ){
                    Folder temp= folders.get(i);
                    folders.set(i,folders.get(j));
                    folders.set(j,temp);
                }
            }
        }
    }

}
