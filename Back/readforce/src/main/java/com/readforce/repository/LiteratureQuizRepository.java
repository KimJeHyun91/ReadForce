package com.readforce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.readforce.entity.LiteratureQuiz;

public interface LiteratureQuizRepository extends JpaRepository<LiteratureQuiz, Long> {
    List<LiteratureQuiz> findByLiterature_LiteratureNoOrderByCreatedDateDesc(Long literatureNo);
}