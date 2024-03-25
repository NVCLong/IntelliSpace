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
public class FolderController {

    @Autowired
    FolderService folderService;

    @PostMapping(value="/folder/root_folder/create/{storageId}", produces ="application/json", consumes = "application/json")
    @ResponseBody
    public ResponseEntity<FolderResponse> createRootFolder(@PathVariable("storageId") Long storageId, @RequestBody Folder folder){
        System.out.println("Creating root folder");
        return ResponseEntity.ok(folderService.createRootFolder(folder,storageId));
    }

    @GetMapping(value="/folder/rootFolders/{storageId}", produces="application/json")
    @ResponseBody
    public ResponseEntity<RootFolderResponse> getRootFolder(@PathVariable("storageId") Long storageId){
        System.out.println("Retrieving root storage");
        return  ResponseEntity.ok(folderService.getRootFolders(storageId));

    }

}
