# Writing up test cases for real estate project

## Add property page

### Success cases

- Add a serious property, with 1 supplementary photo - P
- Add a serious property, with no supplementary photos - P
- Add a seroius property, with 2 supplementary photos - P
- Add a seroius property, with 6 supplementary photos - P
- Add a serious property, with 5 supplementary photos - P
- Add a property with 1 hero photo, no supplementary, and 0 checkboxes - P
- Add a property with no address, expected result: does not accept address - P
- Add a property with a space with an address - P

### Failure cases

- Add a serious property, with 7 supplementary photos - P
- Add a serious property with no hero photo - P
- Add a first name with "strange" characters - P
- Add an ! to a number form - P
- Add a '-' to a number form - P
- Go through all and purposely miss one field - P

## Edit property page

## Success cases

- Edit a value on all fields and see if the value stands up - P
- Edit a value and check the change on "RENTS" field - P
- Add supplementary photo from 0 supplementary photo - P
- Add 4 supplementary photos from 0 supplementary photos - P

### Error cases

1. Add 7 supplementary photos from 0 supplementary photos - P

## Registration and Login page

1. Login with an incorrect password - P
2. Login with an incorrect username - P
3. Try to login with a copy pasted hashed password from the database - P
4. Register a new account - P
5. Register an account with a username with invalid characters - P
6. Register an account where passwords do not match - P

**ALL TOGETHER: 25 tests**
