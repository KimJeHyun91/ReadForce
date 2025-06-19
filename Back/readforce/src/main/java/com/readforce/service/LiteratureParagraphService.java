package com.readforce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.readforce.entity.Literature;
import com.readforce.entity.LiteratureParagraph;
import com.readforce.repository.LiteratureParagraphRepository;
import com.readforce.repository.LiteratureRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LiteratureParagraphService {

    private final LiteratureRepository literatureRepository;
    private final LiteratureParagraphRepository paragraphRepository;

    public LiteratureParagraph create(Long literatureNo, String category, String level, String content) {
        Literature literature = literatureRepository.findById(literatureNo)
            .orElseThrow(() -> new IllegalArgumentException("문학 작품이 존재하지 않음"));
        LiteratureParagraph paragraph = new LiteratureParagraph();
        paragraph.setLiterature(literature);
        paragraph.setCategory(category);
        paragraph.setLevel(level);
        paragraph.setContent(content);
        return paragraphRepository.save(paragraph);
    }

    public List<LiteratureParagraph> getParagraphsByLiterature(Long literatureNo) {
        return paragraphRepository.findByLiterature_LiteratureNoOrderByCreatedDateDesc(literatureNo);
    }

    public void delete(Long paragraphNo) {
        paragraphRepository.deleteById(paragraphNo);
    }

    public void update(Long id, String category, String level, String content) {
        LiteratureParagraph p = paragraphRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("단락이 존재하지 않음"));
        p.setCategory(category);
        p.setLevel(level);
        p.setContent(content);
        paragraphRepository.save(p);
    }
}