# lightweight, security-oriented alpine linux os, we don't need a full linux os b/c it will just be used to run sql queries
FROM alpine:3.18

#Installing sqlite to run sql queries
RUN apk add --no-cache sqlite

#main root directory in docker
WORKDIR /sandbox

#when container starts, default to running sqlite3 engine. We basically type
#sqlite3 to run the sqlite.Think of it like double clicking to open google docs or word docs. 
#Its the double clicking
CMD ["sqlite3"]

