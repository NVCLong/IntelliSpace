package com.webapp.intelligentworkspace.controller;

import com.webapp.intelligentworkspace.model.entity.Folder;
import com.webapp.intelligentworkspace.model.response.FolderResponse;
import com.webapp.intelligentworkspace.model.response.RootFolderResponse;
import com.webapp.intelligentworkspace.service.FolderService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Data
@RequestMapping("/folder")
public class FolderController {

    @Autowired
    FolderService folderService;

    @PostMapping(value="/root_folder/create/{storageId}", produces ="application/json", consumes = "application/json")
    @ResponseBody
    public ResponseEntity<FolderResponse> createRootFolder(@PathVariable("storageId") Long storageId, @RequestBody Folder folder){
        System.out.println("Creating root folder");
        return ResponseEntity.ok(folderService.createRootFolder(folder,storageId));
    }

    @GetMapping(value="/rootFolders/{storageId}", produces="application/json")
    @ResponseBody
    public ResponseEntity<RootFolderResponse> getRootFolder(@PathVariable("storageId") Long storageId){
        System.out.println("Retrieving root storage");
        return  ResponseEntity.ok(folderService.getRootFolders(storageId));

    }

    @PatchMapping(value = "/update/{storageId}/{folderId}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<FolderResponse> updateRootFolders(@PathVariable("storageId") Long storageId, @PathVariable("folderId") Long folderId, @RequestBody String folderName){
        System.out.println("Updating folder");
        return ResponseEntity.ok(folderService.updateFolder(folderId,storageId,folderName));
    }
    @PostMapping(value="/create/folder/{storageId}/{parentFolderId}",produces = "application/json")
    @ResponseBody
    public ResponseEntity<FolderResponse> createFolder(@PathVariable("parentFolderId") Long parentFolderId, @PathVariable("storageId") Long storageId,@RequestBody Folder folder){
        System.out.println("Create FOLDER");
        return  ResponseEntity.ok(folderService.createFolder(folder,parentFolderId,storageId));
    }

    @GetMapping(value="/getFolder/{storageId}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<FolderResponse> getFolder(@PathVariable("storageId") Long storageId,@RequestParam("folderId") Long folderId){
        System.out.println("Getting folder ");
        return ResponseEntity.ok(folderService.getSubFolderById(folderId,storageId));
    }

    @DeleteMapping(value="/delete/{storageId}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<FolderResponse> deleteFolder(@PathVariable ("storageId") Long storageId,@RequestParam("folderId") Long folderId){
        System.out.println("Deleting folder ");
        return ResponseEntity.ok(folderService.deleteFolder(folderId,storageId));
    }
}
