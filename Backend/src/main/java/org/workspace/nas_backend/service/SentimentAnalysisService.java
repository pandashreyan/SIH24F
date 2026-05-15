package org.workspace.nas_backend.service;

import org.springframework.stereotype.Service;
import org.workspace.nas_backend.OpenNLPSentimentAnalyzer;

import java.util.Map;

@Service
public class SentimentAnalysisService {

    private final OpenNLPSentimentAnalyzer analyzer;

    public SentimentAnalysisService(OpenNLPSentimentAnalyzer analyzer) {
        this.analyzer = analyzer;
    }

    // Analyze sentiment for the entire paragraph
    public Map<String, Integer> analyze(String paragraph) {
        return analyzer.analyzeSentimentForParagraph(paragraph);
    }
}
