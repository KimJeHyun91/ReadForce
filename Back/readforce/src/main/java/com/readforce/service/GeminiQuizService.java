package com.readforce.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiQuizService {

    @Value("${gemini.key}")
    private String geminiApiKey;

    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    public Map<String, Object> generateQuiz(String articleContent) {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = String.format("""
            ���� ���� ��縦 �������� �ʵ��л��� Ǯ �� �ִ� ������ ���ط� ���� ���� 1���� JSON �������� �������.
            JSON ������ ������ ���ƾ� ��:
            {
              "question": "���� ����",
              "options": ["����1", "����2", "����3", "����4"],
              "answer": "���� ����"
            }

            ���� ��� ����:
            %s
        """, articleContent);

        Map<String, Object> payload = Map.of(
            "contents", List.of(Map.of(
                "parts", List.of(Map.of("text", prompt))
            ))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(geminiApiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL, request, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
            String text = parts.get(0).get("text");

            // JSON ���ڿ� �Ľ�
            return new ObjectMapper().readValue(text, Map.class);

        } catch (Exception e) {
            throw new RuntimeException("Gemini API ����: " + e.getMessage(), e);
        }
    }
}
