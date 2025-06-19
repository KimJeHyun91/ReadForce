package com.readforce.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//@Entity
//@EntityListeners(AuditingEntityListener.class)
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class Literature {
//	
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	private Long literature_no;
//	
//	@Column(nullable = false)
//	private String title;
//	
//	@CreatedDate
//	private LocalDateTime created_date;	
//	
//}
@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Literature {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "literature_no") // DB 컬럼명 유지
	private Long literatureNo; // 변수명만 camelCase

	@Column(nullable = false)
	private String title;

	@CreatedDate
	@Column(name = "created_date")
	private LocalDateTime createdDate;
	
	@Column(nullable = false)
	private String type;
}