# ==============================================================================
#                                VARIABLES
# ==============================================================================
MKDIR			= mkdir -p
RM				= rm -rf

MARIADB_VOL		= /home/abnsila/data/mariadb
WORDPRESS_VOL	= /home/abnsila/data/wordpress

COMPOSE			= docker compose -f ./srcs/docker-compose.yml



# ==============================================================================
#                                 TARGETS
# ==============================================================================
all: init build

init:
	@sudo $(MKDIR) $(MARIADB_VOL)
	@sudo $(MKDIR) $(WORDPRESS_VOL)

up: init
	$(COMPOSE) up -d

build: init
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

clean: down
	$(COMPOSE) down --volumes --remove-orphans

fclean: clean
# 	Should I delete images too ?
	@sudo $(RM) $(MARIADB_VOL)
	@sudo $(RM) $(WORDPRESS_VOL)
	docker image prune -a


re: fclean all

.PHONY: all init up build down clean fclean re
