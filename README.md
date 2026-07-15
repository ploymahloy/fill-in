# Fill-In

> Keep your tour on track with support from locals in the industry.

## Table of Contents

1. [Inspiration](#inspiration)
2. [Data Schema](#data-schema)
3. [Road Map](#roadmap)

## Inspiration

It is no secret that getting a band off the ground is incredibly difficult. Alongside personality clashes and creative differences, finding band members tends to be the greatest obstacles for even the most "plugged-in" musicians. This app may not reach widespread adoption but will hopefully serve to alleviate the issue to some degree.

## Data Schema

![Logo](./db/schema.png)

## Roadmap

### Database

- [x] Draft PostgreSQL schema
- [x] Stand up database with seed data

### Endpoints

Auth & users

- [ ] POST `/users` (new user signup)
- [ ] POST `/auth/login`
- [ ] GET `/users/me`

Musicians & bands

- [ ] POST `/musicians`
- [x] GET `/musicians`
- [ ] GET `/musicians/:id`
- [ ] PATCH `/musicians/:id`
- [ ] PUT `/musicians/:id/instruments`
- [ ] POST `/bands`
- [ ] GET `/bands/:id`
- [ ] PATCH `/bands/:id`

Reference data

- [x] GET `/instruments`

Tours & gigs

- [ ] GET `/tours`
- [ ] POST `/tours`
- [ ] GET `/tours/:id`
- [ ] PATCH `/tours/:id`
- [ ] GET `/gigs`
- [ ] POST `/gigs`
- [ ] GET `/gigs/:id`
- [ ] PATCH `/gigs/:id`

Gig listings

- [x] GET `/gig-listings` (planned filters: status, instrument_needed, pay_rate, pay_type, status)
- [ ] GET `/gig-listings/:id`
- [ ] POST `/gig-listings`
- [ ] PATCH `/gig-listings/:id` (status: open / filled / cancelled)

Applications

- [ ] GET `/applications` (filter by listing_id and/or musician_id; sort ascending by created_at)
- [ ] POST `/applications`
- [ ] PATCH `/applications/:id` (status: pending / reviewed / shortlisted / accepted / rejected)

### UI

- [ ] Search page for gigs/musicians
- [ ] Design gigs/musician profiles (Searches will return a list of gig/musician cards)
- [ ] Application form for gigs
- [ ] Contact form for musicians