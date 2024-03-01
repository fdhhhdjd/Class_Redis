# Get file .env
include .env
export $(shell sed 's/=.*//' .env)

# Folder constants
DOCKER_COMPOSE := docker-compose.yml
PGPASSWORD := $(POSTGRES_PASSWORD)
PG_CONTAINER := postgresql
FILE_SQL := ./migrations/backup/dump_2024-01-04_15_48_56.sql
FOLDER_BACKUP := ./migrations/backup/dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql

# Run auto
default:
	docker ps

run-build:
	sudo docker-compose -f $(DOCKER_COMPOSE) up -d --build
	
run-down:
	docker-compose -f $(DOCKER_COMPOSE) down		

backup-data-pg_dump:
	docker exec -i $(PG_CONTAINER) pg_dump -h $(PG_CONTAINER) -U $(POSTGRES_USER) $(POSTGRES_DB)  > $(FOLDER_BACKUP)

backup-data-pg_dumpall:
	docker exec -t $(PG_CONTAINER) pg_dumpall -c -U $(POSTGRES_USER) > $(FOLDER_BACKUP)

restore-data:
	cat $(FILE_SQL) | docker exec -i $(PG_CONTAINER) psql -h localhost -U $(POSTGRES_USER) -d $(POSTGRES_DB)