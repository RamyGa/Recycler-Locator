FROM openjdk:11
VOLUME /tmp
COPY target/locations-google-api-0.0.1-SNAPSHOT.jar locations-google-api-0.0.1-SNAPSHOT.jar
EXPOSE 1144
ENTRYPOINT ["java", "-jar", "locations-google-api-0.0.1-SNAPSHOT.jar"]
#CMD ["java",""-Djava.security.egd=file:/dev/./urandom”,”-jar”,”/RestApp-0.0.1-SNAPSHOT.jar”]


