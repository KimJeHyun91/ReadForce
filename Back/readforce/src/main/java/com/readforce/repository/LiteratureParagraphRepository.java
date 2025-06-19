package com.readforce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.readforce.entity.LiteratureParagraph;

public interface LiteratureParagraphRepository extends JpaRepository<LiteratureParagraph, Long> {
    List<LiteratureParagraph> findByLiterature_LiteratureNoOrderByCreatedDateDesc(Long literatureNo);
}
