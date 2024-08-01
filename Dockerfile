
FROM postgres:alpine


ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=base_test


EXPOSE 5432
