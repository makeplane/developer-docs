# Reset password

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