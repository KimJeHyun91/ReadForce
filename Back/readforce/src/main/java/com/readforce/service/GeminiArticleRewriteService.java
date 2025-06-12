package com.readforce.service;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Service
public class GeminiArticleRewriteService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String rewriteArticle(String title, String description, String content, String language) {
        String prompt = String.format("""
            �Ʒ� ���� ������ ������� %s�� �ۼ��� ���� ��� ������ ������ �������ּ���:
            - ������ �������� ���� �ڿ������� ���ۼ�
            - �ʹ� ª�� �ʰ� 500�� �̻�
            - ��� ��Ÿ�� ����

            ����: %s
            ����: %s
            ��� ����: %s
            """, language, title, description, content);

        return callGeminiApi(prompt);
    }

    private String callGeminiApi(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        String url = UriComponentsBuilder
                .fromHttpUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent")
                .queryParam("key", apiKey)
                .toUriString();

        JSONObject requestBody = new JSONObject();
        JSONArray partsArray = new JSONArray().put(new JSONObject().put("text", prompt));
        JSONArray contentsArray = new JSONArray().put(new JSONObject().put("parts", partsArray));
        requestBody.put("contents", contentsArray);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            JSONObject body = new JSONObject(response.getBody());
            JSONArray candidates = body.optJSONArray("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                JSONObject content = candidates.getJSONObject(0).optJSONObject("content");
                if (content != null) {
                    JSONArray parts = content.optJSONArray("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return parts.getJSONObject(0).optString("text", "");
                    }
                }
            }
            throw new RuntimeException("Gemini ���� �Ľ� ����");
        } else {
            throw new RuntimeException("Gemini ȣ�� ����: " + response.getStatusCode());
        }
    }
}
