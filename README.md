# PickPack API

API made with GraphQL using apollo-server-lambda with AWS DynamoDB.

- [Current URL](#Current-URL)
- [Headers for Auth and middleware](#Headers-for-Auth-and-Middleware)
- [Post Tour](#Post-Tour)
- [Upload Image To S3 Bucket](#Upload-Image-To-S3-Bucket)
- [Post Image](#Post-Image)
- [New User](#New-User)
- [Login User](#Login-User)
- [Get Tours](#Get-Tours)

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

#### Post Tour

| Parameter | Description                                     | Required |
| --------- | ----------------------------------------------- | -------- |
| name      | string: The complete name for the tour.         | YES      |
| price     | int: The price for the tour.                    | YES      |
| startDate | string: The start date for the tour (DD/MM/YY). | YES      |
| endDate   | string: The end date for the tour (DD/MM/YY).   | YES      |
| type      | string: The tour's type (DD/MM/YY).             | YES      |

###### Request Example

```
mutation registerTour
  ($name: String!, $price: Int!, $startDate: String!, $endDate: String!, $type: String!) {
    registerTour(name: $name, price: $price, startDate: $startDate, endDate: $endDate, type: $type) {
      name price
      }
    }
```

#### Upload Image To S3 Bucket

| Parameter | Description                            | Required |
| --------- | -------------------------------------- | -------- |
| filename  | string: The complete name of the file. | YES      |
| filetype  | string: The file formar.               | YES      |

###### Request Example

```
mutation uploadToS3($filename: String!, $filetype: String!) {
    uploadToS3(filename: $filename, filetype: $filetype) {
      url
      signedRequest
    }
  }
```

#### Post Image

| Parameter | Description                                                                       | Required |
| --------- | --------------------------------------------------------------------------------- | -------- |
| url       | string: The url given by [Upload Image To S3 Bucket](#Upload-Image-To-S3-Bucket). | YES      |

###### Request Example

```
mutation registerImage($url: String!) {
    registerImage(url: $url) {
      url
      tourPhotoId
    }
  }
```

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

#### Get Tours

###### Request Example

```
query tours {
  tours {
    name type price tourId
    }
  }
```
