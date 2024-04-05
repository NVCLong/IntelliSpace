package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.openai.ChatRequest;
import com.webapp.intelligentworkspace.model.openai.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class OpenAIService {

    @Autowired
    private RestTemplate template;

    @Value("${openAIURL}")
    private String openAIURL;


    public String chat(HttpEntity<ChatRequest> requestEntity, String model) {

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", requestEntity.getBody().getMessages());

        HttpEntity<Map<String, Object>> requestWithModel = new HttpEntity<>(requestBody, requestEntity.getHeaders());
        ResponseEntity<ChatResponse> responseEntity = template.postForEntity(openAIURL, requestWithModel, ChatResponse.class);
        ChatResponse chatResponse = responseEntity.getBody();
        return chatResponse.getChoices().get(0).getMessage().getContent();
    }
}