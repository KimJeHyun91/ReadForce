package com.readforce.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LiteratureQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long literatureQuizNo;

    @Column(nullable = false)
    private String questionText;

    @Column(nullable = false)
    private String choice1;
    @Column(nullable = false)
    private String choice2;
    @Column(nullable = false)
    private String choice3;
    @Column(nullable = false)
    private String choice4;

    @Column(nullable = false)
    private int correctAnswerIndex;

    private String explanation;

    private int score;

    @CreatedDate
    private LocalDateTime createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "literature_no")
    private Literature literature;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "literature_paragraph_no")
    private LiteratureParagraph paragraph;
}