package org.workspace.nas_backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.workspace.nas_backend.service.SentimentAnalysisService;

import java.util.Map;

@RestController
@RequestMapping("/api/sentiment")
public class SentimentAnalysisController {

    private final SentimentAnalysisService service;

    public SentimentAnalysisController(SentimentAnalysisService service) {
        this.service = service;
    }

    @PostMapping
    public Map<String, Integer> analyze(@RequestBody Map<String, String> requestBody) {
        String paragraph = requestBody.get("text");
        return service.analyze(paragraph);
    }
}
