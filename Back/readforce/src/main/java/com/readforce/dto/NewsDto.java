package com.readforce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class NewsDto {

	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public class GetNewsPassage{
		
		private Long new_passage_no;

		private String country;

		private String level;

		private String title;

		private String content;
		
	}
	
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public class GetNewsQuiz{
		
		private Long news_quiz_no;

		private Long news_passage_no;

		private String question_text;

		private String choice1;

		private String choice2;

		private String choice3;

		private String choice4;

		private Long correct_answer_index;

		private String explanation;

		private Double score;

	}
	
	// 기찬
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class GenerateNewsRequest {
	    private String country;  // "kr", "us", ...
	    private String level;    // "초급", "중급", "고급"
	    private String topic;    // 예: "저출산 대책"
	}
	
}
