package com.webapp.intelligentworkspace.controller;


import com.webapp.intelligentworkspace.model.request.ChatRequest;
import com.webapp.intelligentworkspace.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/openai")
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;

    @Value("${openAIModel}")
    private String openAiModel;

    @PostMapping("/chat")
    public String chat(@RequestBody ChatRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity <ChatRequest> requestEntity = new HttpEntity<>(request, headers);
        return openAIService.chat(requestEntity, openAiModel);
    }
}
