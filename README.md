
## Metal Station - Backend API Reference

### Tech Stack

**Server:** Node, Express

**DataBase:** MongoDB

---

## API Reference

### Admin : : Routes 

#### Register A New Admin 

```http
  POST /auth/admin/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**. |

#### Login as Admin 

```http
  POST /auth/admin/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**. |
| `password`   | `string` | **Required**. |

---
### User : : Routes 

#### Register A New User  

```http
  POST /auth/user/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**. |
| `phone` | `string` | **Required**. |

#### Login as User 

```http
  POST /auth/user/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**. |
| `password`   | `string` | **Required**. |

#### Edit User Info  

```http
  PUT /auth/user/edit 
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authToken`   | `string` | **Required**. Header Parameter|
| `name`   | `string` | *If user Wants to edit*. |
| `phone`   | `string` | *If user wants to edit*. |

#### Password reset || Forgot password 

```http
  POST /auth/user/reset 
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | *just to send otp*. |

#### Verify the OTP sent to email (email verification)

```http
  POST /auth/user/verify 
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | *email of the user*. |
| `otp`   | `number` | *otp sent to email*. |
| `password`   | `string` | *if user wants to change the password*. |

#### Google Login 

```http
  POST /auth/user/googlelogin
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `tokenId`   | `string` | *comes from google*. |
| `otp`   | `number` | *otp sent to email*. |
| `password`   | `string` | *if user wants to change the password*. |

--- 
### Blog : : Routes  
####  Add A Blog 

```http
  POST /blogs/add
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `adminToken`   | `string` | **Required**. Header parameter|
| `title`   | `string` | **Required** |
| `description`   | `string` | **Required**. |
| `image`   | `file` | **Required**. |

####  Get All Blogs 

```http
  GET /blogs/getall
```

####  Edit a Blog 

```http
  PUT /blogs/edit
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `adminToken`   | `string` | **Required**. Header parameter|
| `id`   | `string` | object id of Blog |
| `title`   | `string` | if want to edit |
| `description`   | `string` | if want to edit |
| `image`   | `file` | if want to edit |

####  Delete a Blog 

```http
  DELETE /blogs/delete
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `adminToken`   | `string` | **Required**. Header parameter|
| `id`   | `string` | **Required**. Object id of blog |

---
### Marketing : : Emails 

#### Send Emails 
```http
  POST /emails/send
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `adminToken`   | `string` | **Required**. Header parameter|
| `subject`   | `string` | **Required**. Subject of email |
| `text`   | `string` | **Required**. text of email |
| `emailids`   | `Array` | **Required**. Array of emails |

---
### WishList of Users : : Routes  

#### Add to WishList 
```http
  POST /wishlist/add 
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authToken`   | `string` | **Required**. Header parameter|
| `productid`   | `string` | **Required**. Object id of product |

#### Delete from WishList 
```http
  DELETE /wishlist/delete 
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authToken`   | `string` | **Required**. Header parameter|
| `productid`   | `string` | **Required**. Object id of product |

---
### Subcriber  : : Routes  

#### Subscribe to Mails  
```http
  POST /subscribers/subscribe/${id} 
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`   | `param` | **Required**. User Object id (in params)|

#### Unsubscriber to Mails 
```http
  DELETE /unsubscribe/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`   | `param` | **Required**. User object id (in params) |

---
### SELL  : : Routes  

#### Sell A Product / Metal  
```http
  POST /sell/sell  
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**.|
| `fullName`   | `string` | **Required**.|
| `phone`   | `string` | **Required**.|
| `type`   | `string` | **Required**. (automobile , metal) |
| `vechileNumber`   | `string` | **Required**. if type is automobile  |
| `VechileName`   | `string` | **Required**. if type is automobile  |
| `weight`   | `` | **Required**. if type is metal  |
| `metalType`   | `string` | **Required**. if type is metal  |

---
### SCRAP  : : Routes  

#### Scrap A Product / Metal  
```http
  POST /sell/scrap  
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**.|
| `fullName`   | `string` | **Required**.|
| `phone`   | `string` | **Required**.|
| `type`   | `string` | **Required**. (automobile , metal) |
| `vechileNumber`   | `string` | **Required**. if type is automobile  |
| `VechileName`   | `string` | **Required**. if type is automobile  |
| `weight`   | `` | **Required**. if type is metal  |
| `metalType`   | `string` | **Required**. if type is metal  |


---
### Product  : : Routes  

#### Add a Product   
```http
  POST /sell/scrap  
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**.|
| `fullName`   | `string` | **Required**.|
| `phone`   | `string` | **Required**.|
| `type`   | `string` | **Required**. (automobile , metal) |
| `vechileNumber`   | `string` | **Required**. if type is automobile  |
| `VechileName`   | `string` | **Required**. if type is automobile  |
| `weight`   | `` | **Required**. if type is metal  |
| `metalType`   | `string` | **Required**. if type is metal  |



