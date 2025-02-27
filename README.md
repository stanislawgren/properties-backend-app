# COVERTREE_WEATHERSTACK_API_TASK

## Tech stack

- Nest.js
- TypeScript
- MongoDB (used in cloud - to access database paste proper data to .env file)
- GraphQL (code-first)
- Jest
- Weatherstack API

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## .env file

Add .env file in root folder and paste proper data (db is provided below with testuser account)

```bash
WEATHERSTACK_API_KEY="YOUR_KEY"
MONGODB="mongodb+srv://testuser:testuser@cluster0.gfj0o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
```

# How to

To test API, run project following above instructions and visit `http://localhost:3000/graphql` to use queries and mutations.

## User Stories

1. As a user I can query all the properties.

example:

```bash
query GetProperties {
  getProperties {
    city
    lat
    long
    state
    street
    zipCode
  }
}
```

2. As a user I am able to sort the properties by date of creation

```bash
query GetProperties($filters: PropertyFilterInput) {
  getProperties(filters: $filters) {
    city
    lat
    long
    state
    street
    zipCode
  }
}
```

You can choose to sort in ASC or DESC order:

```bash

{
  "filters": {
    "sortByDate": "DESC"
  }
}

{
  "filters": {
    "sortByDate": "ASC"
  }
}

```

3. As a user, I’m able to filter the properties list by their city, zip code and state, where they are located.

Same query with additional filters:

```bash
query GetProperties($filters: PropertyFilterInput) {
  getProperties(filters: $filters) {
    city
    lat
    long
    state
    street
    zipCode
  }
}
```

filters ex.:

```bash

{
  "filters": {
    "sortByDate": "DESC",
    "state": "NY",
    "zipCode": "10001",
    "city": "New York"
  }
}

```

assumption: filters are case-insesitive, but work on exact values

4. As a user, I can query details of any property.

It's possible by providing ID of property to query

```bash
query GetPropertyById($getPropertyByIdId: String!) {
  getPropertyById(id: $getPropertyByIdId) {
    city
    lat
    long
    state
    street
    weather {
      cloudcover
      feelslike
      humidity
      observationTime
      precip
      pressure
      temperature
      uvIndex
      visibility
      weatherCode
      weatherDescriptions
      weatherIcons
      windDegree
      windDir
      windSpeed
    }
  }
}
```

```bash

{
  "getPropertyByIdId": "67c035ddd62ad6130e45e080"
}

```

5. As a user, I can add a new property.

```bash
mutation Mutation($createPropertyInput: CreatePropertyInput!) {
  createProperty(createPropertyInput: $createPropertyInput) {
    lat
    long
    weather {
      temperature
      cloudcover
      feelslike
      humidity
    }
  }
}
```

Input (zipCode must be exactly 5 digits, otherwise it will produce an error):

```bash
{
  "createPropertyInput": {
    "city": "Homer",
    "state": "AL",
    "street": "401 Cozy Cove Dr",
    "zipCode": "99603"
  }
}
```

6. As a user, I can delete any property

It's possible by providing ID of property to mutation

```bash

mutation Mutation($deletePropertyByIdId: String!) {
  deletePropertyById(id: $deletePropertyByIdId)
}

```

Input:

```bash
{
  "deletePropertyByIdId": "67c04556be5ef4f7e01bc3d4"
}
```

Property Properties:

```bash
getProperties {
    _id
    city
    lat
    long
    state
    street
    weather {
      cloudcover
      feelslike
      humidity
      observationTime
      precip
      pressure
      temperature
      uvIndex
      visibility
      weatherCode
      weatherDescriptions
      weatherIcons
      windDegree
      windDir
      windSpeed
    }
  }
```
