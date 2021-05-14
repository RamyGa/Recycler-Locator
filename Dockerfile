FROM openjdk:11
VOLUME /tmp
ARG JAR_FILE=target/locations-google-api-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","app.jar"]


