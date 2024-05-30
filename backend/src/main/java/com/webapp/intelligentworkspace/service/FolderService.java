package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.entity.File;
import com.webapp.intelligentworkspace.model.entity.Folder;
import com.webapp.intelligentworkspace.model.entity.Storage;
import com.webapp.intelligentworkspace.model.response.FolderResponse;
import com.webapp.intelligentworkspace.model.response.RootFolderResponse;
import com.webapp.intelligentworkspace.repository.FileRepository;
import com.webapp.intelligentworkspace.repository.FolderRepository;
import com.webapp.intelligentworkspace.repository.StorageRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
@Data
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;
    @Autowired
    private StorageRepository storageRepository;
    @Autowired
    private FileRepository fileRepository;

    private FileService fileService;
    private  final String base64EncodedKey = "9fWSwatmHu2KQwLoDA1rSQ==";

    public FolderService(FolderRepository folderRepository, StorageRepository storageRepository, FileRepository fileRepository, FileService fileService) {
        this.folderRepository = folderRepository;
        this.storageRepository = storageRepository;
        this.fileRepository = fileRepository;
        this.fileService = fileService;
    }

    // find all rootFolder with storage id and parent folder id
    public RootFolderResponse getRootFolders(Long storageId){
        System.out.println(storageId);
        List<Folder> rootFolderList = folderRepository.findAllRootFolderById(storageId);
        sortFolders(rootFolderList);
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
            List<File> files= fileRepository.findByFolderAndIsDeletedIsFalse(folder);
            System.out.println(files.toString());
            Folder parentFolder = null;
            if(folder.getParentFolder() != null) {
                parentFolder= folderRepository.findById(folder.getParentFolder().getId()).orElse(null);
            }
            sortFolders(subFolders);
            return FolderResponse.builder()
                    .folder(folder)
                    .storage(storage)
                    .parentFolder(parentFolder)
                    .subFolders(subFolders)
                    .message("Success to find the folder")
                    .status("Success")
                    .files(files)
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
            return  new FolderResponse( storage,folder,null,null,"success","CreateRootFolder success",null);
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
                List<File> files= fileRepository.findByFolderAndIsDeletedIsFalse(folder);
                Queue<Folder> queue = new LinkedList<>();
//                Queue<File> fileQueue= new LinkedList<>();
//                fileQueue.addAll(files);
                queue.add(folder);
                while (!queue.isEmpty()) {
                    Folder currentFolder = queue.poll();
                    Folder parentFolder = currentFolder.getParentFolder();
                    if(parentFolder!=null){
                        parentFolder.getSubFolders().remove(currentFolder);
                    }
                    List<Folder> subFolderList= folderRepository.findAllByParentFolderId(currentFolder.getId());
                    System.out.println("Looking for all files in folder: "+ currentFolder.getName() +" with id: "+ currentFolder.getId());
                    List<File> fileList = findFilesRecursively(currentFolder);
                    System.out.println(fileList);
                    if(!fileList.isEmpty()) {
                        for (File f : fileList) {
                            System.out.println("File id: " + f.getId());
                            fileService.moveToTrash(f.getId());
                        }
                    }
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

    private List<File> findFilesRecursively(Folder folder) {
        List<File> allFiles = new ArrayList<>();

        // Fetch files for the current folder
        List<File> directFiles = fileRepository.findByFolderAndIsDeletedIsFalse(folder);
        allFiles.addAll(directFiles);

        // Get subfolders and recurse
        List<Folder> subFolders = folderRepository.findAllByParentFolderId(folder.getId());
        for (Folder subFolder : subFolders) {
            allFiles.addAll(findFilesRecursively(subFolder));
        }

        return allFiles;
    }

    //hash code the string contain folderId and user storageId
    public String generateShareCode(Long folderId, Long storageId, Integer userId) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        Folder folder= folderRepository.findById(folderId).orElse(null);
        if(folder==null){
            return null;
        }
        setPublic(folder);
        byte[] decodedKey= Base64.getDecoder().decode(base64EncodedKey);
        SecretKey key= new SecretKeySpec(decodedKey,"AES");

        String privateInformation= folderId+"."+storageId +"."+userId;

        Cipher cipher= Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE,key);
        byte[] encryptedBytes= cipher.doFinal(privateInformation.getBytes());
        String enodeString=Base64.getEncoder().encodeToString(encryptedBytes);
        System.out.println("Encode String: "+ enodeString);
        return  enodeString;
    }

    public FolderResponse getShareFolder(String privateShareCode) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        byte[] decodedKey= Base64.getDecoder().decode(base64EncodedKey);
        SecretKey key= new SecretKeySpec(decodedKey,"AES");

        Cipher cipher= Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE,key);
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(privateShareCode));
        String decryptedString= new String(decryptedBytes);
        System.out.println(decryptedString);

        long folderId= Long.parseLong(decryptedString.split("\\.")[0]);
        long storageId= Long.parseLong(decryptedString.split("\\.")[1]);
        return  getSubFolderById(folderId,storageId);
    }

    private void setPublic(Folder folder){
        Queue<Folder> queue = new LinkedList<>();
        queue.add(folder);
        while (!queue.isEmpty()){
            System.out.println("Running");
            Folder currentFolder = queue.poll();
            List<Folder> subFolder= folderRepository.findAllByParentFolderId(currentFolder.getId());
            queue.addAll(subFolder);
            currentFolder.setPublic(true);
            folderRepository.save(currentFolder);
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
