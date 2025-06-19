package com.readforce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.readforce.entity.Literature;

public interface LiteratureRepository extends JpaRepository<Literature, Long> {
    List<Literature> findAllByOrderByLiteratureNoDesc(); // 번호 기준 내림차순
}
