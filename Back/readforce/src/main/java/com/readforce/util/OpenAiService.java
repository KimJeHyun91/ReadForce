package com.readforce.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OpenAiService {

    @Value("${openai.api.key}")
    private String OPENAI_API_KEY;

//    public String getChatCompletion(String prompt) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.setBearerAuth(OPENAI_API_KEY);
//
//        Map<String, Object> body = new HashMap<>();
//        body.put("model", "gpt-4");
//        body.put("messages", List.of(
//            Map.of("role", "system", "content", "당신은 노련한 저널리스트입니다."),
//            Map.of("role", "user", "content", prompt)
//        ));
//        body.put("temperature", 0.8);
//
//        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
//        RestTemplate restTemplate = new RestTemplate();
//
//        ResponseEntity<String> response = restTemplate.postForEntity(
//            "https://api.openai.com/v1/chat/completions", request, String.class
//        );
//
//        // GPT 응답에서 content 추출 (JSON 파싱)
//        JSONObject json = new JSONObject(response.getBody());
//        String result = json
//            .getJSONArray("choices")
//            .getJSONObject(0)
//            .getJSONObject("message")
//            .getString("content");
//
//        return result; // 여기선 string으로 반환 (title+content 포함됨)
//    }
    public String getChatCompletion(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(OPENAI_API_KEY);

        Map<String, Object> body = new HashMap<>();
//        body.put("model", "gpt-4");
        body.put("model", "gpt-3.5-turbo");
        body.put("messages", List.of(
            Map.of("role", "system", "content", "당신은 노련한 저널리스트입니다."),
            Map.of("role", "user", "content", prompt)
        ));
        body.put("temperature", 0.8);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            System.out.println("📤 OpenAI API 요청 전송 중...");
            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions", request, String.class
            );
            System.out.println("📥 OpenAI 응답 수신 완료");

            JSONObject json = new JSONObject(response.getBody());
            System.out.println("🧩 응답 본문: " + response.getBody());

            String result = json
                .getJSONArray("choices")
                .getJSONObject(0)
                .getJSONObject("message")
                .getString("content");

            return result;
        } catch (Exception e) {
            System.out.println("❌ OpenAI 호출 실패: " + e.getMessage());
            throw new RuntimeException("OpenAI 호출 중 오류 발생", e);
        }
    }
}