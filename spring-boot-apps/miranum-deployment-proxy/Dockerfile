FROM openjdk:11-jre-slim

EXPOSE 8080

RUN mkdir -p /app

COPY miranum-deployment-proxy-example/target/*.jar /app/spring-boot-application.jar

CMD ["java","-jar","/app/spring-boot-application.jar"]
