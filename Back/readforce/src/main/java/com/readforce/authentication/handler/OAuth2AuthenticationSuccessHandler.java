package com.readforce.authentication.handler;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.readforce.authentication.dto.OAuth2UserDto;
import com.readforce.authentication.service.AuthenticationService;
import com.readforce.authentication.util.JwtUtil;
import com.readforce.common.MessageCode;
import com.readforce.common.enums.Name;
import com.readforce.common.enums.Prefix;
import com.readforce.common.exception.JsonException;
import com.readforce.member.entity.Member;
import com.readforce.member.service.AttendanceService;
import com.readforce.member.service.MemberService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	private final JwtUtil jwtUtil;
	private final AuthenticationService authenticationService;
	private final MemberService memberService;
	private final AttendanceService attendanceService;
	private final StringRedisTemplate redisTemplate;
	
	@Value("${custom.fronted.social-login-success.exist-member-url}")
	private String socialLoginSuccessExistMemberUrl;
	
	@Value("${custom.fronted.social-login-success.new-member-url}")
	private String socailLoginSuccessNewMemberUrl;

	@Override
	public void onAuthenticationSuccess(
			HttpServletRequest httpServletRequest, 
			HttpServletResponse httpServletResponse,
			Authentication authentication
	) throws IOException, ServletException {
		
		OAuth2UserDto oAuth2UserDto = (OAuth2UserDto) authentication.getPrincipal();
		
		boolean isNewUser = oAuth2UserDto.isNewUser();
		String email = oAuth2UserDto.getEmail();
		
		String existingRefreshToken = Prefix.REFRESH.getContent() + email;
		
		if(redisTemplate.hasKey(existingRefreshToken)) {
			
			redisTemplate.delete(existingRefreshToken);
			
		}
		
		String targetUrl;
		
		if(isNewUser) {
			
			String temporalToken = UUID.randomUUID().toString();
			
			Map<String, String> socialInfo = Map.of(
					"email", email,
					"socialProvider", oAuth2UserDto.getRegistrationId(),
					"socialId", oAuth2UserDto.getName()					
			);
			
			try {
				
				String socialInfoJson = new ObjectMapper().writeValueAsString(socialInfo);
				
				redisTemplate.opsForValue().set(
						Prefix.SOCIAL_SIGN_UP.getContent() + temporalToken,
						socialInfoJson,
						Duration.ofMinutes(10)
				);
				
			} catch(JsonProcessingException exception) {
				
				throw new JsonException(MessageCode.JSON_PROCESSING_FAIL);
				
			}
			
			targetUrl = UriComponentsBuilder.fromUriString(socailLoginSuccessNewMemberUrl)
					.queryParam(Name.TEMPORAL_TOKEN.toString(), temporalToken)
					.build()
					.toUriString();
						
		} else {
			
			final UserDetails userDetails = authenticationService.loadUserByUsername(email);
			final String accessToken = jwtUtil.generateAccessToken(userDetails);
			final String refreshToken = jwtUtil.generateRefreshToken(userDetails);
			
			Member member = memberService.getActiveMemberByEmail(email);
			
			String temporalToken = UUID.randomUUID().toString();
			
			Map<String, String> tokenMap = Map.of(
					Name.ACCESS_TOKEN.toString(), accessToken,
					Name.REFESH_TOKEN.toString(), refreshToken,
					Name.NICKNAME.toString(), member.getNickname(),
					Name.SOCIAL_PROVIDER.toString(), member.getSocialProvider()
			);
			
			redisTemplate.opsForValue().set(
					Prefix.TEMPORAL + temporalToken,
					new ObjectMapper().writeValueAsString(tokenMap),
					Duration.ofMinutes(3)
			);
			
			authenticationService.storeRefreshToken(email, refreshToken);
			
			attendanceService.recordAttendance(email);
			
			targetUrl = UriComponentsBuilder.fromUriString(socialLoginSuccessExistMemberUrl)
					.queryParam(Name.TEMPORAL_TOKEN.toString(), temporalToken)
					.build()
					.toUriString();
			
		}
		
		httpServletResponse.sendRedirect(targetUrl);
			
	}
	
	
	
	
	
}
