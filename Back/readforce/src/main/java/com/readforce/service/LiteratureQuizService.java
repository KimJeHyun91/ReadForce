package com.readforce.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.readforce.entity.Literature;
import com.readforce.entity.LiteratureParagraph;
import com.readforce.entity.LiteratureQuiz;
import com.readforce.repository.LiteratureParagraphRepository;
import com.readforce.repository.LiteratureQuizRepository;
import com.readforce.repository.LiteratureRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LiteratureQuizService {

    private final LiteratureRepository literatureRepository;
    private final LiteratureParagraphRepository paragraphRepository;
    private final LiteratureQuizRepository quizRepository;

    public LiteratureQuiz create(Map<String, String> body) {
        Long literatureNo = Long.valueOf(body.get("literatureNo"));
        Long paragraphNo = Long.valueOf(body.get("paragraphNo"));

        Literature literature = literatureRepository.findById(literatureNo)
            .orElseThrow(() -> new IllegalArgumentException("문학 작품 없음"));
        LiteratureParagraph paragraph = paragraphRepository.findById(paragraphNo)
            .orElseThrow(() -> new IllegalArgumentException("단락 없음"));

        LiteratureQuiz quiz = new LiteratureQuiz();
        quiz.setLiterature_no(literatureNo);
        quiz.setLiterature_paragraph(paragraph);
        quiz.setQuestion_text(body.get("questionText"));
        quiz.setChoice1(body.get("choice1"));
        quiz.setChoice2(body.get("choice2"));
        quiz.setChoice3(body.get("choice3"));
        quiz.setChoice4(body.get("choice4"));
        quiz.setCorrect_answer_index(Integer.parseInt(body.get("correctAnswerIndex")));
        quiz.setExplanation(body.get("explanation"));
        quiz.setScore(Integer.parseInt(body.getOrDefault("score", "1")));

        return quizRepository.save(quiz);
    }

    public List<LiteratureQuiz> listByLiterature(Long literatureNo) {
        return quizRepository.findByLiterature_LiteratureNoOrderByCreatedDateDesc(literatureNo);
    }

    public void delete(Long quizNo) {
        quizRepository.deleteById(quizNo);
    }

    public void update(Long quizNo, Map<String, String> body) {
        LiteratureQuiz quiz = quizRepository.findById(quizNo)
            .orElseThrow(() -> new IllegalArgumentException("문제 없음"));
        quiz.setQuestion_text(body.get("questionText"));
        quiz.setChoice1(body.get("choice1"));
        quiz.setChoice2(body.get("choice2"));
        quiz.setChoice3(body.get("choice3"));
        quiz.setChoice4(body.get("choice4"));
        quiz.setCorrect_answer_index(Integer.parseInt(body.get("correctAnswerIndex")));
        quiz.setExplanation(body.get("explanation"));
        quiz.setScore(Integer.parseInt(body.getOrDefault("score", "1")));
        quizRepository.save(quiz);
    }
}