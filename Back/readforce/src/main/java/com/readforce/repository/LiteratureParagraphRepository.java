package com.readforce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readforce.entity.LiteratureParagraph;
import com.readforce.id.LiteratureParagraphId;

@Repository
public interface LiteratureParagraphRepository extends JpaRepository<LiteratureParagraph, LiteratureParagraphId>{

	List<LiteratureParagraph> findByLiterature_LiteratureNoOrderByCreatedDateDesc(Long literatureNo);

}
