package com.webapp.intelligentworkspace.config;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureConfiguration {
    @Value("${connection_string}")
    private String connectionString;

    @Bean
    public BlobServiceClient blobServiceClient(){

        return  new BlobServiceClientBuilder().connectionString(connectionString).buildClient();
    }
}
