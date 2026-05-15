package org.workspace.nas_backend;

import opennlp.tools.doccat.DoccatModel;
import opennlp.tools.doccat.DocumentCategorizerME;
import opennlp.tools.tokenize.SimpleTokenizer;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Component
public class OpenNLPSentimentAnalyzer {

    private final DoccatModel sentimentModel;
    private final SentenceDetectorME sentenceDetector;

    // Constructor to load sentiment and sentence detector models
    public OpenNLPSentimentAnalyzer() {
        try (InputStream sentimentModelStream = getClass().getResourceAsStream("/sentiment-model.bin");
             InputStream sentenceModelStream = getClass().getResourceAsStream("/en-sent.bin")) {

            if (sentimentModelStream == null || sentenceModelStream == null) {
                throw new RuntimeException("Model file not found in resources");
            }
            this.sentimentModel = new DoccatModel(sentimentModelStream);
            this.sentenceDetector = new SentenceDetectorME(new SentenceModel(sentenceModelStream));

        } catch (Exception e) {
            throw new RuntimeException("Error loading models", e);
        }
    }

    // Analyze sentiment for a paragraph and return counts for each sentiment
    public Map<String, Integer> analyzeSentimentForParagraph(String paragraph) {
        // Preprocess the paragraph to add spaces after punctuation if missing
        paragraph = paragraph.replaceAll("(?<!\\s)([.?!])", "$1 ");

        // Split the paragraph into sentences
        String[] sentences = sentenceDetector.sentDetect(paragraph);

        // Initialize counters for sentiments
        Map<String, Integer> sentimentCounts = new HashMap<>();
        sentimentCounts.put("positive", 0);
        sentimentCounts.put("negative", 0);
        sentimentCounts.put("neutral", 0);

        // Tokenizer for splitting sentences into words
        SimpleTokenizer tokenizer = SimpleTokenizer.INSTANCE;

        // Loop through each sentence and classify the sentiment
        for (String sentence : sentences) {
            String[] tokens = tokenizer.tokenize(sentence);

            // Categorize the sentence
            DocumentCategorizerME categorizer = new DocumentCategorizerME(sentimentModel);
            double[] outcomes = categorizer.categorize(tokens);
            String category = categorizer.getBestCategory(outcomes);

            // Increment the respective sentiment count
            // Normalize the category to remove any prefixes like "__label__"
            String normalizedCategory = category.replace("__label__", "");

// Increment the respective sentiment count if it's a valid sentiment
            if (sentimentCounts.containsKey(normalizedCategory)) {
                sentimentCounts.put(normalizedCategory, sentimentCounts.get(normalizedCategory) + 1);
            }
        }
        return sentimentCounts; // Return the counts for each sentiment
    }
}
