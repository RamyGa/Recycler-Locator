FROM openjdk:11
COPY target/locations-google-api-0.0.1-SNAPSHOT.jar locations-google-api-0.0.1-SNAPSHOT.jar
EXPOSE 1144
ENTRYPOINT ["java", "-jar", "locations-google-api-0.0.1-SNAPSHOT.jar"]