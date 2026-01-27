---
title: Reset password
description: Learn how to reset password for self-hosted Plane. Complete guide with step-by-step instructions.
keywords: plane, self-hosting, deployment, plane installation, configuration, administration
---


# Reset password
Users can reset their password through the terminal of the Plane application. You need to login to backend docker container and run the below command for resetting a user’s password.

1. Get the container id for **plane-api**.
    ```bash
    docker ps
    ``` 

2. Log in to the container.
    ```bash
    docker exec -it <container_id> /bin/sh
    ```

3. Run the reset password command.
    ```bash
    python manage.py reset_password <email>
    ```
::: tip
The email should be of an already existing user on the Plane application. If the email is not attached to any user the command will throw an error.
:::