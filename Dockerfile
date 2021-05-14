FROM openjdk:11
VOLUME /tmp
ARG JAR_FILE
ADD ${JAR_FILE} /locations.google.api.jar
ENTRYPOINT ["java","-jar","/locations.google.api.jar"]


