package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.entity.Storage;
import com.webapp.intelligentworkspace.model.response.StorageResponse;
import com.webapp.intelligentworkspace.repository.StorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StorageService {
    @Autowired
    private StorageRepository storageRepository;

    public Storage createStorage(){
        Storage newStorage = new Storage();
        newStorage.setCurrentStorage(0);
        System.out.println("Create storage successfully");
        return storageRepository.save(newStorage);
    }

    // update a current capacity in storage when user upload file in

    public StorageResponse updateCapacity(Long storageId,float fileSize){
        System.out.println(fileSize);
        fileSize= fileSize/1000000;
        if(fileSize >1.0){
            System.out.println("File is over the maximum storage");
            return StorageResponse.builder().storage(null).message("File is over the maximum value").status(false).build();
        }else {
            Storage currentStorage = storageRepository.findById(storageId).orElse(null);
            if(currentStorage==null){
                return StorageResponse.builder().storage(null).message("Can not find the storage in database").status(false).build();
            }else{
                float current = currentStorage.getCurrentStorage();
                if( current+fileSize >1){
                    return StorageResponse.builder().storage(currentStorage).message("The remaining capacity is not enough").status(false).build();
                }else{
                    current+=fileSize;
                    currentStorage.setCurrentStorage(current);
                    storageRepository.save(currentStorage);
                    return  StorageResponse.builder().storage(currentStorage).message("Upload Successfully").status(true).build();
                }
            }
        }
    }

    // update a current capacity in storage when user delete file in
    public StorageResponse deleteCapacity(Long storageId, float fileSize){
        Storage storage= storageRepository.findById(storageId).orElse(null);
        if(storage==null){
            return StorageResponse.builder().storage(null).message("Can not find the storage").status(false).build();
        }else{
            float currentCapacity= storage.getCurrentStorage()-fileSize;
            storage.setCurrentStorage(currentCapacity);
            storageRepository.save(storage);
            return StorageResponse.builder().storage(storage).message("Delete SuccessFully").status(true).build();
        }
    }


    public float calculateRemainingCapacity(Long id){
        Storage storage= storageRepository.findById(id).orElse(null);
        if(storage==null){
            return 0;
        }else{
            return storage.getMaxStorage()- storage.getCurrentStorage();
        }
    }
}
