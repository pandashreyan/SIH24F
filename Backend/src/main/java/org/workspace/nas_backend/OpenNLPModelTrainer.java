package org.workspace.nas_backend;

import opennlp.tools.doccat.*;
import opennlp.tools.util.InputStreamFactory;
import opennlp.tools.util.ObjectStream;
import opennlp.tools.util.PlainTextByLineStream;
import opennlp.tools.util.TrainingParameters;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class OpenNLPModelTrainer {
    public static void main(String[] args) {
        try {
            // Read the input training data into a list
            InputStreamFactory inputStreamFactory = () -> new FileInputStream("src/main/java/org/workspace/nas_backend/training-data.txt");
            List<String> lines = new ArrayList<>();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStreamFactory.createInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    lines.add(line);
                }
            }

            // Shuffle and split the data
            Collections.shuffle(lines);
            int splitIndex = (int) (lines.size() * 0.9);
            List<String> trainingData = lines.subList(0, splitIndex);
            List<String> testingData = lines.subList(splitIndex, lines.size());

            // Create ObjectStreams for training data
            try (ObjectStream<String> lineStream = new PlainTextByLineStream(() -> new ByteArrayInputStream(String.join("\n", trainingData).getBytes(StandardCharsets.UTF_8)), StandardCharsets.UTF_8);
                 ObjectStream<DocumentSample> sampleStream = new DocumentSampleStream(lineStream)) {

                // Training parameters
                TrainingParameters params = new TrainingParameters();
                params.put(TrainingParameters.ITERATIONS_PARAM, 100);
                params.put(TrainingParameters.CUTOFF_PARAM, 1);

                // Train the model
                DoccatModel model = DocumentCategorizerME.train("en", sampleStream, params, new DoccatFactory());

                // Save the model to a file
                try (OutputStream modelOut = new BufferedOutputStream(new FileOutputStream("sentiment-model.bin"))) {
                    model.serialize(modelOut);
                }

                System.out.println("Model training complete. Model saved as sentiment-model.bin");

                // Test the model
                // Test the model
                DocumentCategorizerME categorizer = new DocumentCategorizerME(model);
                int correct = 0;
                int total = testingData.size();

                for (String testLine : testingData) {
                    String[] parts = testLine.split("\t", 2);
                    if (parts.length == 2) {
                        String expectedCategory = parts[0];
                        String document = parts[1];

                        // Tokenize the document string
                        String[] tokens = document.split("\\s+"); // Simple whitespace-based tokenization

                        double[] outcomes = categorizer.categorize(tokens);
                        String predictedCategory = categorizer.getBestCategory(outcomes);

                        if (expectedCategory.equals(predictedCategory)) {
                            correct++;
                        }
                    }
                }

                System.out.printf("Testing complete. Accuracy: %.2f%%\n", (correct / (double) total) * 100);

            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
