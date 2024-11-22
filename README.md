# DB migration
$ npm run migrate {name}

# run
## local
$ npm run start

# DB backup - restore
## backup
$ mysqldump -u {username} -p {db_name} > {db_name}.sql
## restore
$ mysql -u {username} -p {new_name} < {db_name}.sql