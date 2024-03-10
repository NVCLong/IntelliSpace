package com.webapp.intelligentworkspace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IntelligentWorkSpaceApplication {

    public static void main(String[] args) {
        System.out.println("http://localhost:8888");

        SpringApplication.run(IntelligentWorkSpaceApplication.class, args);
    }

}
