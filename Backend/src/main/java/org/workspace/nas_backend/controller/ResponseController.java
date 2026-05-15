package org.workspace.nas_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.workspace.nas_backend.model.Response;
import org.workspace.nas_backend.service.ResponseService;

import java.util.Map;

@RestController
@RequestMapping("/api/responses")
public class ResponseController {

    private final ResponseService service;

    public ResponseController(ResponseService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> processResponse(@RequestBody ResponseDTO dto) {
        // Save and split the response
        Response savedResponse = service.saveAndSplitResponse(dto.getUserInput(), dto.getResponse());

        // Replace nulls with empty strings before sending the response
        savedResponse.replaceNullWithEmpty();

        // Create a response object to send back the questions
        return ResponseEntity.ok(Map.of(
                "question1", savedResponse.getQuestion1(),
                "question2", savedResponse.getQuestion2(),
                "question3", savedResponse.getQuestion3(),
                "question4", savedResponse.getQuestion4()
        ));
    }
}
