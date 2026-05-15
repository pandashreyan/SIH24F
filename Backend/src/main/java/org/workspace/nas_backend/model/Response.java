package org.workspace.nas_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "responses")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_input", nullable = false)
    private String userInput;

    @Column(name = "question1")
    private String question1;

    @Column(name = "question2")
    private String question2;

    @Column(name = "question3")
    private String question3;

    @Column(name = "question4")
    private String question4;

    // Ensure null values are replaced with empty strings
    public void replaceNullWithEmpty() {
        this.question1 = this.question1 == null ? "" : this.question1;
        this.question2 = this.question2 == null ? "" : this.question2;
        this.question3 = this.question3 == null ? "" : this.question3;
        this.question4 = this.question4 == null ? "" : this.question4;
    }
}
