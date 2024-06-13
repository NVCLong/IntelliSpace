package com.webapp.intelligentworkspace.service;

import com.webapp.intelligentworkspace.model.request.ChatRequest;
import com.webapp.intelligentworkspace.model.request.Message;
import com.webapp.intelligentworkspace.model.response.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    @Autowired
    private RestTemplate template;

    @Value("${openAIURL}")
    private String openAIURL;
    @Value("${openAIModel}")
    private String openAiModel;


    public String chat(HttpEntity<ChatRequest> requestEntity, String model) {
        System.out.println(requestEntity);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", requestEntity.getBody().getMessages());


        HttpEntity<Map<String, Object>> requestWithModel = new HttpEntity<>(requestBody, requestEntity.getHeaders());
        ResponseEntity<ChatResponse> responseEntity = template.postForEntity(openAIURL, requestWithModel, ChatResponse.class);
        ChatResponse chatResponse = responseEntity.getBody();
        return chatResponse.getChoices().get(0).getMessage().getContent();
    }

    public String summarizeNote(String note){
        String prompt = "sumarize this note with the total characters < 255  "+ note;
        ChatRequest chatRequest= new ChatRequest(openAiModel,prompt);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity <ChatRequest> requestEntity = new HttpEntity<>(chatRequest, headers);

        Map<String, Object> requestBody= new HashMap<>();
        requestBody.put("model", openAiModel);
        requestBody.put("messages", requestEntity.getBody().getMessages());
        System.out.println(requestBody);

        HttpEntity<Map<String,Object>> requestWithModel= new HttpEntity<>(requestBody,requestEntity.getHeaders());
        ResponseEntity<ChatResponse> responseEntity = template.postForEntity(openAIURL, requestWithModel, ChatResponse.class);
        
        return responseEntity.getBody().getChoices().get(0).getMessage().getContent();
    }

}