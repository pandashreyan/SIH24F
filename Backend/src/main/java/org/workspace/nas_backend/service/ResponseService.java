package org.workspace.nas_backend.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.workspace.nas_backend.model.Response;
import org.workspace.nas_backend.repository.ResponseRepository;

@Service
public class ResponseService {

    private final ResponseRepository repository;

    public ResponseService(ResponseRepository repository) {
        this.repository = repository;
    }

    public Response saveAndSplitResponse(String userInput, String response) {
        // Split the response string by '#' delimiter
        String[] questions = response.split("#");

        // Create a Response entity
        Response responseEntity = new Response();
        responseEntity.setUserInput(userInput);
        responseEntity.setQuestion1(questions.length > 0 ? questions[0] : null);
        responseEntity.setQuestion2(questions.length > 1 ? questions[1] : null);
        responseEntity.setQuestion3(questions.length > 2 ? questions[2] : null);
        responseEntity.setQuestion4(questions.length > 3 ? questions[3] : null);

        // Save the entity to the database
        return repository.save(responseEntity);
    }
}
