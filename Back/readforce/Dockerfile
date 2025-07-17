# 1. 빌드 단계: Gradle을 사용하여 애플리케이션을 빌드합니다.
FROM gradle:jdk17-jammy AS build

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# Gradle 관련 파일들을 먼저 복사하여 종속성을 캐시합니다.
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

# 애플리케이션 소스 코드를 복사합니다.
COPY src ./src

# Gradle을 사용하여 테스트를 제외하고 애플리케이션을 빌드합니다.
RUN gradle build --no-daemon -x test

# 2. 실행 단계: 빌드된 애플리케이션을 실행합니다.
FROM eclipse-temurin:17-jre-jammy

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 빌드 단계에서 생성된 JAR 파일을 복사합니다.
# 'readforce-0.0.1-SNAPSHOT.jar' 부분은 실제 생성된 JAR 파일 이름으로 변경해야 할 수 있습니다.
COPY --from=build /app/build/libs/*.jar app.jar

# 8080 포트를 노출합니다.
EXPOSE 8080

# 애플리케이션을 실행합니다.
ENTRYPOINT ["java", "-jar", "app.jar"]