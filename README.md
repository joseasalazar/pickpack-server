# PickPack API

API made with GraphQL using apollo-server-lambda with AWS DynamoDB.

- [Current URL](#Current-URL)
- [Headers for Auth and middleware](#Headers-for-Auth-and-Middleware)
- [New User](#New-User)
- [Login User](#Login-User)

### Current URL

Current deployed URL

```
https://u2mqz07q4e.execute-api.us-east-1.amazonaws.com/dev/graphql
```

### Headers for Auth and Middleware

| Key           | Value          |
| ------------- | -------------- |
| Authorization | Bearer [token] |

| Parameter | Description                               |
| --------- | ----------------------------------------- |
| token     | Token retrieved after a successful login. |

## NO Authorization Header Required

#### New User

| Parameter | Description                                                                 | Required |
| --------- | --------------------------------------------------------------------------- | -------- |
| name      | string: The complete name of the user.                                      | YES      |
| email     | string: The email of the user with email format.                            | YES      |
| password  | string: The password in plain text, encryption will be done in the backend. | YES      |

###### Request Example

```
mutation signup($name: String!, $email: String!, $password: String!){
  signup(name: $name, email: $email, password: $password){
    token
    user {
      name
      email
      userId
    }
  }
}
```

###### Example Response

```
{
  "data": {
    "signup": {
      "token": [token],
      "user": {
        "name": "Name",
        "email": "Email",
        "userId": "913c1110-ff63-413f-81c9-dfdf57b217d9"
      }
    }
  }
}
```

#### Login user

| Parameter | Description                                                                 | Required |
| --------- | --------------------------------------------------------------------------- | -------- |
| email     | string: The email of the user with email format.                            | YES      |
| password  | string: The password in plain text, encryption will be done in the backend. | YES      |

###### Request Example

```
mutation login($email: String!, $password: String!){
  login(email: $email, password: $password){
    token
    user {
      name
      userId
    }
  }
}
```
