package com.readforce.member.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.readforce.common.enums.Role;
import com.readforce.common.enums.Status;
import com.readforce.result.entity.Challenge;
import com.readforce.result.entity.Learning;
import com.readforce.result.entity.Result;
import com.readforce.result.entity.Score;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long memberNo;
	
	@Column(nullable = false)
	private String password;
	
	@Column(nullable = false, unique = true)
	private String email;
	
	@Column(nullable = false, unique = true)
	private String nickname;
	
	@Column(nullable = false)
	private LocalDate birthday;
	
	private String profileImagePath;
	
	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status = Status.ACTIVE;
	
	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role = Role.USER;
	
	private String socialProvider;
	
	private String socialId;
	
	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;
	
	@LastModifiedDate
	@Column(nullable = false)
	private LocalDateTime lastModifiedAt;
	
	private LocalDateTime withdrawAt;
	
	@Builder.Default
	@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Attendance> attendanceList = new ArrayList<>();
	
	@Builder.Default
	@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Challenge> challengeList = new ArrayList<>();
	
	@Builder.Default
	@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Learning> learningList = new ArrayList<>();
	
	@Builder.Default
	@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Result> resultList = new ArrayList<>();
	
	@Builder.Default
	@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Score> scoreList = new ArrayList<>();
	
	public void changeSocialInfo(String socialProvider, String socialId) {
		
		this.socialProvider = socialProvider;
		this.socialId = socialId;		
		
	}
	
	public void modifyInformation(String nickname, LocalDate birthday, String profileImagePath) {
		
		if(nickname != null) {
			
			this.nickname = nickname;
						
		}
		
		if(birthday != null) {
			
			this.birthday = birthday;
						
		}
	
		if(profileImagePath != null) {
			
			this.profileImagePath = profileImagePath;
			
		}
		
	}
	
	public void deactivate() {
		
		this.status = Status.PENDING_DELETION;
		this.withdrawAt = LocalDateTime.now();
		
	}
	
	public void resetPassword(String password) {
		
		this.password = password;
		
	}

	
	
}
