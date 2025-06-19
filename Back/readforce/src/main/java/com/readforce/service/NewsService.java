package com.readforce.service;

import java.util.List;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.readforce.dto.NewsDto.GenerateNewsRequest;
import com.readforce.dto.NewsDto.GetNewsPassage;
import com.readforce.dto.NewsDto.GetNewsQuiz;
import com.readforce.entity.News;
import com.readforce.entity.NewsQuiz;
import com.readforce.enums.MessageCode;
import com.readforce.exception.NewsException;
import com.readforce.repository.NewsPassageRepository;
import com.readforce.repository.NewsQuizRepository;
import com.readforce.util.OpenAiService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsService {
	
	private final NewsPassageRepository news_passage_repository;
	private final NewsQuizRepository news_quiz_repository;
    private final OpenAiService openAiService; // 이 줄 추가!

	
	// 나라에 해당하는 뉴스 기사 리스트(내림차순) 가져오기
//	public List<GetNewsPassage> getNewsPassageListByCountry(String country) {
//
//		List<GetNewsPassage> news_passage_list = news_passage_repository.findByCountryOrderByCreatedDate(country);
//		
//		if(news_passage_list.isEmpty()) {
//			
//			throw new NewsException(MessageCode.NEWS_PASSAGE_NOT_FOUND);
//			
//		}
//		
//		return news_passage_list;
//	}

	
	// 나라와 난이도에 해당하는 뉴스 기사 리스트(내림차순) 가져오기
//	public List<GetNewsPassage> getNewsPassagelistByCountryAndLevel(String country, String level) {
//		
//		List<GetNewsPassage> news_passage_list = news_passage_repository.findByCountryAndLevelOrderByCreatedDate(country, level);
//		
//		if(news_passage_list.isEmpty()) {
//			
//			throw new NewsException(MessageCode.NEWS_PASSAGE_NOT_FOUND);
//			
//		}
//		
//		return news_passage_list;
//		
//	}

	// 뉴스 문제 가져오기
//	public GetNewsQuiz getNewsQuizObject(Long news_passage_no) {
//
//		return news_quiz_repository.findByNewsPassageNo(news_passage_no)
//				.orElseThrow(() -> new NewsException(MessageCode.NEWS_QUIZ_NOT_FOUND));
//
//	}
	
	// 기찬
//	public NewsPassage generateNewsWithAI(GenerateNewsRequest request) {
//	    System.out.println("🚀 프롬프트 생성 시작");
//
//	    String prompt = buildPrompt(request.getCountry(), request.getLevel(), request.getTopic());
//	    System.out.println("📌 생성된 프롬프트: \n" + prompt);
//
//	    String aiResponse = openAiService.getChatCompletion(prompt);  // 아래 서비스 참고
//
//	    // 파싱 로직 (예시: JSON 형식으로 제목과 본문을 반환한다고 가정)
//	    JSONObject json = new JSONObject(aiResponse);
//	    String title = json.getString("title");
//	    String content = json.getString("content");
//
//	    NewsPassage news = new NewsPassage();
//	    news.setCountry(request.getCountry());
//	    news.setLevel(request.getLevel());
//	    news.setTitle(title);
//	    news.setContent(content);
//	    
//	    return news_passage_repository.save(news);
//	}
//
//	private String buildPrompt(String country, String level, String topic) {
//	    return String.format("""
//	        다음 정보를 바탕으로 뉴스 기사를 생성해주세요.
//
//	        국가: %s
//	        난이도: %s
//	        주제: %s
//
//	        다음 조건을 따라주세요:
//	        - 제목은 1줄
//	        - 본문은 500자 이상
//	        - 정치/사회/경제 등 현실적인 이슈처럼 작성
//	        - 응답은 아래 JSON 형식으로 작성해주세요:
//
//	        {
//	          "title": "기사 제목",
//	          "content": "기사 본문"
//	        }
//	        """, country, level, topic);
//	}

}
