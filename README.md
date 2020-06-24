# Login Node.js SDK

## Getting Started

You need to install @blue-cloud/login and set API credentials before you get started

## Installation

```shell script
npm i @blue-cloud/login
```


## Usage in Nest Js auth.guard.ts

set  process.env.LOGIN_URL = 'https://login.yourdomain.com';

```ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as login from '@blue-cloud/login';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const next = context.switchToHttp().getNext();

    if (!request.headers.authorization) {
      throw new HttpException('Missing token', HttpStatus.FORBIDDEN);
    }

    if (request.headers.authorization.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    try {
      return (new Promise((resolve, reject) => {
        login
          .authenticate()(request, response, (err) => {
            if(err) return next(err);
            resolve(true);
          });
      }));
    } catch(error) {
      const message = `Token Error ${error.message || error.name}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}

```

## Usage in node express app

```js
/**
 * Main application file
 */
if (!process.env.LOGIN_SECRET) {
  process.env.LOGIN_SECRET = 'your-secret';
}

if (!process.env.LOGIN_URL) {
  process.env.LOGIN_URL = 'https://login.yourdomain.com';
}

const http = require('http');
const express = require('express');

const bodyParser = require('body-parser');
const login = require('@blue-cloud/login');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/secured', login.authenticate, (req, res) => {
  return res.json(req.user);
  // - req.user show user details, only if user session is active and url is secured by OmniLogin
});

server.listen(8000, '0.0.0.0', (err) => {
  if (err) return console.log('Error while starting nodejs', err);
  return console.log('Server started');
});
```
