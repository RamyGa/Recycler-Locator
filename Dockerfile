FROM openjdk:11
COPY target/locations-google-api-0.0.1-SNAPSHOT.jar locations-google-api-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/locations-google-api-0.0.1-SNAPSHOT.jar"]
EXPOSE 8080:8080