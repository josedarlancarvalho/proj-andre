ARG JAR_FILE=target/backend-0.0.1-SNAPSHOT.jar
FROM openjdk:17-jdk-slim
WORKDIR /opt/app
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","app.jar"] 