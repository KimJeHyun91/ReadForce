//package com.readforce.controller;
//
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.validation.annotation.Validated;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PatchMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.readforce.dto.MemberDto.GetMemberObject;
//import com.readforce.entity.Literature;
//import com.readforce.enums.MessageCode;
//import com.readforce.service.AttendanceService;
//import com.readforce.service.LiteratureParagraphService;
//import com.readforce.service.LiteratureQuizService;
//import com.readforce.service.LiteratureService;
//import com.readforce.service.MemberService;
//
//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.NotBlank;
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/admin")
//@RequiredArgsConstructor
//@Validated
//public class AdminController {
//	
//	private final MemberService member_service;
//	private final AttendanceService attendance_service;
//    private final LiteratureService literatureService;
//    private final LiteratureParagraphService paragraphService;
//    private final LiteratureQuizService literatureQuizService;
//
//    // 전체 회원 목록 조회
//	@PreAuthorize("hasRole('ADMIN')")
//	@GetMapping("/get-all-member-list")
//	public ResponseEntity<List<GetMemberObject>> getAllMemberList(){
//		
//		List<GetMemberObject> member_list = member_service.getAllMemberList();
//		
//		return ResponseEntity.status(HttpStatus.OK).body(member_list);
//	}
//	
//	// 계정 비활성화
//	@PreAuthorize("hasRole('ADMIN')")
//	@PatchMapping("/deactivate-member")
//	public ResponseEntity<Map<String, String>> deactivateMember(
//			@RequestParam("email")
//			@NotBlank(message = MessageCode.EMAIL_NOT_BLANK)
//			@Email(message = MessageCode.EMAIL_PATTERN_INVALID)
//			String email
//	){
//		
//		member_service.withdrawMember(email);
//		
//		return ResponseEntity.status(HttpStatus.OK).body(Map.of(MessageCode.MESSAGE_CODE, MessageCode.MEMBER_DEACTIVATE_SUCCESS));
//		
//	}
//	
//	// 계정 활성화
//	@PreAuthorize("hasRole('ADMIN')")
//	@PatchMapping("/activate-member")
//	public ResponseEntity<Map<String, String>> activateMember(
//			@RequestParam("email")
//			@NotBlank(message = MessageCode.EMAIL_NOT_BLANK)
//			@Email(message = MessageCode.EMAIL_PATTERN_INVALID)
//			String email		
//	){
//		
//		member_service.activateMember(email);
//		
//		return ResponseEntity.status(HttpStatus.OK).body(Map.of(MessageCode.MESSAGE_CODE, MessageCode.MEMBER_ACTIVATE_SUCCESS));
//		
//	}
//	
//	// 출석일 조회
//	@PreAuthorize("hasRole('ADMIN')")
//	// @PatchMapping("/get-attendance-count")
//	@GetMapping("/get-attendance-count")
//	public ResponseEntity<Long>  getAttendanceCount(
//			@RequestParam("email")
//			@NotBlank(message = MessageCode.EMAIL_NOT_BLANK)
//			@Email(message = MessageCode.EMAIL_PATTERN_INVALID)
//			String email		
//	){
//		
//		Long attandance_count = attendance_service.getAttendanceCount(email);
//		
//		return ResponseEntity.status(HttpStatus.OK).body(attandance_count);
//		
//	}
//	
//	// 문학
//	@PostMapping("/create")
//    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
//        return ResponseEntity.ok(literatureService.create(body.get("title")));
//    }
//
//    @GetMapping("/list")
//    public ResponseEntity<List<Literature>> getList() {
//        return ResponseEntity.ok(literatureService.findAll());
//    }
//
//    @PatchMapping("/update")
//    public ResponseEntity<?> update(@RequestParam Long id, @RequestParam String title) {
//        literatureService.update(id, title);
//        return ResponseEntity.ok().build();
//    }
//
//    @DeleteMapping("/delete")
//    public ResponseEntity<?> delete(@RequestParam Long id) {
//        literatureService.delete(id);
//        return ResponseEntity.ok().build();
//    }
//    
// // 문학 단락 등록
//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping("/paragraph/create")
//    public ResponseEntity<?> createParagraph(@RequestBody Map<String, String> body) {
//        Long literatureNo = Long.valueOf(body.get("literatureNo"));
//        return ResponseEntity.ok(paragraphService.create(
//            literatureNo,
//            body.get("category"),
//            body.get("level"),
//            body.get("content")
//        ));
//    }
//
//    // 문학 단락 리스트 조회
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/paragraph/list")
//    public ResponseEntity<?> listParagraphs(@RequestParam Long literatureNo) {
//        return ResponseEntity.ok(paragraphService.getParagraphsByLiterature(literatureNo));
//    }
//
//    // 문학 단락 수정
//    @PreAuthorize("hasRole('ADMIN')")
//    @PatchMapping("/paragraph/update")
//    public ResponseEntity<?> updateParagraph(@RequestBody Map<String, String> body) {
//        Long paragraphNo = Long.valueOf(body.get("paragraphNo"));
//        paragraphService.update(
//            paragraphNo,
//            body.get("category"),
//            body.get("level"),
//            body.get("content")
//        );
//        return ResponseEntity.ok().build();
//    }
//
//    // 문학 단락 삭제
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/paragraph/delete")
//    public ResponseEntity<?> deleteParagraph(@RequestParam Long paragraphNo) {
//        paragraphService.delete(paragraphNo);
//        return ResponseEntity.ok().build();
//    }
//    
//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping("/quiz/create")
//    public ResponseEntity<?> createQuiz(@RequestBody Map<String, String> body) {
//        return ResponseEntity.ok(literatureQuizService.create(body));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/quiz/list")
//    public ResponseEntity<?> listQuiz(@RequestParam Long literatureNo) {
//        return ResponseEntity.ok(literatureQuizService.listByLiterature(literatureNo));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/quiz/delete")
//    public ResponseEntity<?> deleteQuiz(@RequestParam Long quizNo) {
//        literatureQuizService.delete(quizNo);
//        return ResponseEntity.ok().build();
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PatchMapping("/quiz/update")
//    public ResponseEntity<?> updateQuiz(@RequestParam Long quizNo, @RequestBody Map<String, String> body) {
//        literatureQuizService.update(quizNo, body);
//        return ResponseEntity.ok().build();
//    }
//	
//}
package com.readforce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.readforce.dto.MemberDto.GetMemberObject;
import com.readforce.entity.Literature;
import com.readforce.enums.MessageCode;
import com.readforce.service.AttendanceService;
//import com.readforce.service.LiteratureParagraphService;
//import com.readforce.service.LiteratureQuizService;
import com.readforce.service.LiteratureService;
import com.readforce.service.MemberService;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Validated
public class AdminController {

    private final MemberService member_service;
    private final AttendanceService attendance_service;
    private final LiteratureService literatureService;
//    private final LiteratureParagraphService paragraphService;
//    private final LiteratureQuizService literatureQuizService;

    // ========================= 회원 관리 =========================

//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/member/list")
//    public ResponseEntity<List<GetMemberObject>> getAllMemberList() {
//        return ResponseEntity.ok(memberService.getAllMemberList());
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PatchMapping("/member/deactivate")
//    public ResponseEntity<Map<String, String>> deactivateMember(
//        @RequestParam("email")
//        @NotBlank(message = MessageCode.EMAIL_NOT_BLANK)
//        @Email(message = MessageCode.EMAIL_PATTERN_INVALID)
//        String email) {
//        memberService.withdrawMember(email);
//        return ResponseEntity.ok(Map.of(MessageCode.MESSAGE_CODE, MessageCode.MEMBER_DEACTIVATE_SUCCESS));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PatchMapping("/member/activate")
//    public ResponseEntity<Map<String, String>> activateMember(
//        @RequestParam("email")
//        @NotBlank(message = MessageCode.EMAIL_NOT_BLANK)
//        @Email(message = MessageCode.EMAIL_PATTERN_INVALID)
//        String email) {
//        memberService.activateMember(email);
//        return ResponseEntity.ok(Map.of(MessageCode.MESSAGE_CODE, MessageCode.MEMBER_ACTIVATE_SUCCESS));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/member/attendance-count")
//    public ResponseEntity<Long> getAttendanceCount(
//        @RequestParam("email")
//        @NotBlank(message = MessageCode.EMAIL_NOT_BLANK)
//        @Email(message = MessageCode.EMAIL_PATTERN_INVALID)
//        String email) {
//        return ResponseEntity.ok(attendanceService.getAttendanceCount(email));
//    }
  // 전체 회원 목록 조회
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/get-all-member-list")
	public ResponseEntity<List<GetMemberObject>> getAllMemberList(){
		
		List<GetMemberObject> member_list = member_service.getAllMemberList();
		
		return ResponseEntity.status(HttpStatus.OK).body(member_list);
	}
	
	// 계정 비활성화
	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/deactivate-member")
	public ResponseEntity<Map<String, String>> deactivateMember(
			@RequestParam("email")
			@NotBlank(message = MessageCode.EMAIL_NOT_BLANK)
			@Email(message = MessageCode.EMAIL_PATTERN_INVALID)
			String email
	){
		
		member_service.withdrawMember(email);
		
		return ResponseEntity.status(HttpStatus.OK).body(Map.of(MessageCode.MESSAGE_CODE, MessageCode.MEMBER_DEACTIVATE_SUCCESS));
		
	}
	
	// 계정 활성화
	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/activate-member")
	public ResponseEntity<Map<String, String>> activateMember(
			@RequestParam("email")
			@NotBlank(message = MessageCode.EMAIL_NOT_BLANK)
			@Email(message = MessageCode.EMAIL_PATTERN_INVALID)
			String email		
	){
		
		member_service.activateMember(email);
		
		return ResponseEntity.status(HttpStatus.OK).body(Map.of(MessageCode.MESSAGE_CODE, MessageCode.MEMBER_ACTIVATE_SUCCESS));
		
	}
	
	// 출석일 조회
	@PreAuthorize("hasRole('ADMIN')")
	// @PatchMapping("/get-attendance-count")
	@GetMapping("/get-attendance-count")
	public ResponseEntity<Long>  getAttendanceCount(
			@RequestParam("email")
			@NotBlank(message = MessageCode.EMAIL_NOT_BLANK)
			@Email(message = MessageCode.EMAIL_PATTERN_INVALID)
			String email		
	){
		
		Long attandance_count = attendance_service.getAttendanceCount(email);
		
		return ResponseEntity.status(HttpStatus.OK).body(attandance_count);
		
	}

    // ========================= 문학 =========================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/literature-create")
    public ResponseEntity<?> createLiterature(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(literatureService.create(body.get("title")));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/literature-list")
    public ResponseEntity<List<Literature>> getLiteratureList() {
        return ResponseEntity.ok(literatureService.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/literature-update")
    public ResponseEntity<?> updateLiterature(@RequestParam Long id, @RequestParam String title) {
        literatureService.update(id, title);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/literature-delete")
    public ResponseEntity<?> deleteLiterature(@RequestParam Long id) {
        literatureService.delete(id);
        return ResponseEntity.ok().build();
    }

    // ========================= 문학 단락 =========================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/literature")
    public ResponseEntity<Literature> getLiteratureById(@RequestParam Long id) {
        return ResponseEntity.ok(literatureService.findById(id));
    }
//    
//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping("/paragraph-create")
//    public ResponseEntity<?> createParagraph(@RequestBody Map<String, String> body) {
//        Long literatureNo = Long.valueOf(body.get("literatureNo"));
//        return ResponseEntity.ok(paragraphService.create(
//            literatureNo,
//            body.get("category"),
//            body.get("level"),
//            body.get("content")
//        ));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/paragraph-list")
//    public ResponseEntity<?> listParagraphs(@RequestParam Long literatureNo) {
//        return ResponseEntity.ok(paragraphService.getParagraphsByLiterature(literatureNo));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PatchMapping("/paragraph-update")
//    public ResponseEntity<?> updateParagraph(@RequestBody Map<String, String> body) {
//        Long paragraphNo = Long.valueOf(body.get("paragraphNo"));
//        paragraphService.update(
//            paragraphNo,
//            body.get("category"),
//            body.get("level"),
//            body.get("content")
//        );
//        return ResponseEntity.ok().build();
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/paragraph-delete")
//    public ResponseEntity<?> deleteParagraph(@RequestParam Long paragraphNo) {
//        paragraphService.delete(paragraphNo);
//        return ResponseEntity.ok().build();
//    }

    // ========================= 문학 퀴즈 =========================

//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping("/quiz-create")
//    public ResponseEntity<?> createQuiz(@RequestBody Map<String, String> body) {
//        return ResponseEntity.ok(literatureQuizService.create(body));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/quiz-list")
//    public ResponseEntity<?> listQuiz(@RequestParam Long literatureNo) {
//        return ResponseEntity.ok(literatureQuizService.listByLiterature(literatureNo));
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/quiz-delete")
//    public ResponseEntity<?> deleteQuiz(@RequestParam Long quizNo) {
//        literatureQuizService.delete(quizNo);
//        return ResponseEntity.ok().build();
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PatchMapping("/quiz-update")
//    public ResponseEntity<?> updateQuiz(@RequestParam Long quizNo, @RequestBody Map<String, String> body) {
//        literatureQuizService.update(quizNo, body);
//        return ResponseEntity.ok().build();
//    }

}