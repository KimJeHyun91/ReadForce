package com.readforce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.readforce.entity.Literature;
import com.readforce.repository.LiteratureRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LiteratureService {

    private final LiteratureRepository literatureRepository;

    public Literature create(String title) {
        Literature lit = new Literature();
        lit.setTitle(title);
        return literatureRepository.save(lit);
    }

    public List<Literature> findAll() {
        return literatureRepository.findAllByOrderByLiteratureNoDesc();
    }

    public void update(Long id, String newTitle) {
        Literature lit = literatureRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Not found"));
        lit.setTitle(newTitle);
        literatureRepository.save(lit);
    }

    public void delete(Long id) {
        literatureRepository.deleteById(id);
    }
    
    public Literature findById(Long id) {
        return literatureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("문학 정보를 찾을 수 없습니다."));
    }
    
}