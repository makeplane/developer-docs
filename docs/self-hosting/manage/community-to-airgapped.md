---
title: Upgrade from Community to Airgapped Edition
description: Deploy Plane in airgapped environment without internet access. Complete guide for offline Plane installation.
keywords: plane community to airgapped, edition upgrade, airgapped migration, offline deployment, air-gapped plane, self-hosting
---

# Upgrade from Community to Airgapped Edition

This guide walks you through migrating your existing Plane Community Edition data to an air-gapped environment. You'll backup your current installation, transfer the data, and restore it in your air-gapped setup.

::: warning
**Important**  
Make sure you already have Commercial Airgapped Edition installed on a fresh machine before starting this migration. If you haven't installed it yet, follow our [airgapped installation guide](/self-hosting/methods/airgapped-edition) first.
:::

## Prerequisites

- Install the [Commercial Airgapped Edition](/self-hosting/methods/airgapped-edition) on a fresh machine, not the one running the Community Edition.
- Be sure to log in as the root user or as a user with sudo access. The `/opt` folder requires sudo or root privileges.

## Backup data on Community instance

1. Download the latest version of `setup.sh`.

```bash
curl -fsSL https://github.com/makeplane/plane/releases/latest/download/setup.sh -o setup.sh
```

2. Run the setup.sh backup script to take the backup of the Community Edition instance.

```bash
./setup.sh backup
```

This will create a backup of the plane community instance in the `backup/` folder with the timestamp as the folder name.

```bash
backup/
└── 20250605-0938
   ├── pgdata.tar.gz
   ├── rabbitmq_data.tar.gz
   ├── redisdata.tar.gz
   └── uploads.tar.gz
```

## Restore data on Airgapped instance

1. On the server running the Commercial Airgapped Edition, create a file named `restore-airgapped.sh` with the following content:

   ```bash
   #!/bin/bash
   set -euo pipefail

   function print_header() {
   clear

   cat <<"EOF"
   ##+.    ##+    .##-
    ######+.######-.######.
    #######.   -###    +#####+.
    #######.      +       +######.
    #######.              .#######
    #######.              .#######
     #######       +      .#######
       .+#####+    ###-   .#######
           .######.-#####+.+######
               -##.    -##    .+##
   EOF
   }

   function restoreData() {

       echo ""
       echo "****************************************************"
       echo "We are about to restore your data from the backup files."
       echo "****************************************************"
       echo ""

       # set the backup folder path
       BACKUP_FOLDER=${1}

       if [ -z "$BACKUP_FOLDER" ]; then
           BACKUP_FOLDER="$PWD/backup"
           read -p "Enter the backup folder path [$BACKUP_FOLDER]: " BACKUP_FOLDER
           if [ -z "$BACKUP_FOLDER" ]; then
               BACKUP_FOLDER="$PWD/backup"
           fi
       fi

       # check if the backup folder exists
       if [ ! -d "$BACKUP_FOLDER" ]; then
           echo "Error: Backup folder not found at $BACKUP_FOLDER"
           exit 1
       fi

       # check if there are any .tar.gz files in the backup folder
       if ! ls "$BACKUP_FOLDER"/*.tar.gz 1> /dev/null 2>&1; then
           echo "Error: Backup folder does not contain .tar.gz files"
           exit 1
       fi

       echo ""
       echo "Using backup folder: $BACKUP_FOLDER"
       echo ""

       # ask for current install path
       AIRGAPPED_INSTALL_PATH="$HOME/planeairgapped"
       read -p "Enter the airgapped instance install path [$AIRGAPPED_INSTALL_PATH]: " AIRGAPPED_INSTALL_PATH
       if [ -z "$AIRGAPPED_INSTALL_PATH" ]; then
           AIRGAPPED_INSTALL_PATH="$HOME/planeairgapped"
       fi

       # check if the airgapped instance install path exists
       if [ ! -d "$AIRGAPPED_INSTALL_PATH" ]; then
           echo "Error: Airgapped instance install path not found at $AIRGAPPED_INSTALL_PATH"
           exit 1
       fi

       echo ""
       echo "Using airgapped instance install path: $AIRGAPPED_INSTALL_PATH"
       echo ""

       # check if the docker-compose.yaml exists
       if [ ! -f "$AIRGAPPED_INSTALL_PATH/docker-compose.yml" ]; then
           echo "Error: docker-compose.yml not found at $AIRGAPPED_INSTALL_PATH/docker-compose.yml"
           exit 1
       fi

       local dockerServiceStatus
       if command -v jq &> /dev/null; then
           dockerServiceStatus=$($COMPOSE_CMD ls --filter name=plane-airgapped --format=json | jq -r .[0].Status)
       else
           dockerServiceStatus=$($COMPOSE_CMD ls --filter name=plane-airgapped | grep -o "running" | head -n 1)
       fi

       if [[ $dockerServiceStatus == "running" ]]; then
           echo "Plane Airgapped is running. Please STOP the Plane Airgapped before restoring data."
           exit 1
       fi

       CURRENT_USER_ID=$(id -u)
       CURRENT_GROUP_ID=$(id -g)

       # if the data folder not exists, create it
       if [ ! -d "$AIRGAPPED_INSTALL_PATH/data" ]; then
           mkdir -p "$AIRGAPPED_INSTALL_PATH/data"
           chown -R $CURRENT_USER_ID:$CURRENT_GROUP_ID "$AIRGAPPED_INSTALL_PATH/data"
       fi

       # Extract all backup tar files
       for BACKUP_FILE in "$BACKUP_FOLDER"/*.tar.gz; do
           if [ -e "$BACKUP_FILE" ]; then
               BASE_FILE_NAME=$(basename "$BACKUP_FILE" ".tar.gz")
               echo "Extracting $BASE_FILE_NAME"
               tar -xzvf "$BACKUP_FILE" -C "$AIRGAPPED_INSTALL_PATH/data/"
               if [ $? -ne 0 ]; then
                   echo "Error: Failed to extract $BACKUP_FILE"
                   exit 1
               fi
           else
               echo "No .tar.gz files found in the current directory."
               echo ""
               echo "Please provide the path to the backup file."
               echo ""
               echo "Usage: $0 /path/to/backup"
               exit 1
           fi
       done

       DATA_DIR="$AIRGAPPED_INSTALL_PATH/data"

       # Rename extracted directories to match docker-compose volume paths
       # Backup tars: pgdata, redisdata, uploads, rabbitmq_data
       # Docker-compose expects: db, redis, minio/uploads, mq

       if [ -d "$DATA_DIR/pgdata" ]; then
           rm -rf "$DATA_DIR/db"
           mv "$DATA_DIR/pgdata" "$DATA_DIR/db"
           echo "Renamed pgdata -> db"
       fi

       if [ -d "$DATA_DIR/redisdata" ]; then
           rm -rf "$DATA_DIR/redis"
           mv "$DATA_DIR/redisdata" "$DATA_DIR/redis"
           echo "Renamed redisdata -> redis"
       fi

       if [ -d "$DATA_DIR/uploads" ]; then
           mkdir -p "$DATA_DIR/minio"
           rm -rf "$DATA_DIR/minio/uploads"
           mv "$DATA_DIR/uploads" "$DATA_DIR/minio/uploads"
           echo "Renamed uploads -> minio/uploads"
       fi

       if [ -d "$DATA_DIR/rabbitmq_data" ]; then
           rm -rf "$DATA_DIR/mq"
           mv "$DATA_DIR/rabbitmq_data" "$DATA_DIR/mq"
           echo "Renamed rabbitmq_data -> mq"
       fi

       # Fix ownership on all restored data
       chown -R $CURRENT_USER_ID:$CURRENT_GROUP_ID "$DATA_DIR"

       echo ""
       echo "Restore completed successfully."
       echo ""
   }

   # if docker-compose is installed
   if command -v docker-compose &> /dev/null
   then
       COMPOSE_CMD="docker-compose"
   else
       COMPOSE_CMD="docker compose"
   fi

   print_header
   restoreData "$@"
   ```

   This allows you to restore the Community Edition data to the Commercial Airgapped instance.

2. Make the script executable:

   ```bash
   chmod +x restore-airgapped.sh
   ```

3. Move your entire backup folder to the server running the Commercial Airgapped Edition using whatever secure method works in your environment.

4. Open terminal, and execute the following command:

   ```bash
   sudo bash restore-airgapped.sh ./20250605-0938
   ```

   The script will prompt you to enter the Commercial Airgapped Edition installation folder path.

5. After the data restore is finished, start the instance.

   ```bash
   cd <airgapped-instance-folder>
   sudo docker compose -f docker-compose.yml down
   sudo docker compose -f docker-compose.yml --env-file plane.env up -d
   ```

   You can now access the Commercial Airgapped instance at `http://<ip-address|domain-name>`

Once your migration is complete, verify that all your projects, issues, and team data have been successfully transferred to your air-gapped environment.
