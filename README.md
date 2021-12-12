# Defect Tracking API

Send a GET request to `/` to fetch all defects.

- GET [/v1/defects](https://defect-api.herokuapp.com/v1/defects)

Filter the returned data set using URL query parameters. For instance, fetch all defects associated with the panel having the serial number 46832446869:

- GET [/v1/defects/46832446881](https://defect-api.herokuapp.com/v1/defects/46832446869)
- GET [/v1/defects?Panel_ID=46832446881](https://defect-api.herokuapp.com/v1/defects?Panel_ID=46832446869)

Fetch all defects having both the serial number '46832446881' and the defect type of 'CC'

- GET [/v1/defects?Panel_ID=46832446881&Defect_Type=CC](https://defect-api.herokuapp.com/v1/defects?Panel_ID=46832446881&Defect_Type=CC)

Fetch all MS defects from Stringer 1:

- GET [/v1/defects?Panel_ID=46832446881&Defect_Type=CC](https://defect-api.herokuapp.com/v1/defects?From=Stringer+1&Defect_Type=MS)

Adding defect entries involves sending a POST request having the panel's serial number as a URL parameter and the rest of the panel data in the request body. This data will exclude the UID element as that is dynamically determined at time of insertion. 

- POST `/v1/defects/46832447010`

Request body:

        {
            Date: 11/13/2021,
            Time: 10:40+PM,
            Location: E04,
            From: Stringer 3,
            Defect_Type: CC,
            Cause: Machine,
            Found: EL PreLam (QC3)
        }