Spodatify

[![Netlify Status](https://api.netlify.com/api/v1/badges/ea87ce8f-b21a-46be-b61c-18bed66891fc/deploy-status)](https://app.netlify.com/sites/snazzy-liger-6fc261/deploys)

---
LINK: [SPODATIFY](snazzy-liger-6fc261.netlify.app)


Temporarly credentails to use: 
Email: squeak_discs.0b@icloud.com
Password: squeak_discs.0b

### Current Progress
The application has been set up as a front-end client side React applicaion. It connects to Supabase which handles the OAuth to Spotidy and provides back a token in order to communicate with the Spotify API. Movereover, additional options are added to authoraze certain access (to which the users is warned and agress on) such as profile and private playlists. An example is when clicked `Get User Info` the app is able to fetch private data such as location and email. I also tried to make it look a bit pretty( *dark mode* ). 

### What's next?
Use the Spotify API to pull playlists and get locations fron the Supabase database to display them by using Mapbox's API. 

### What does your application do?
The application should allow an user to connect to their Spotify account and then pull their selected playlists with songs and in return get a map of people from cities which also have same interests in music as them based on the artists' top listeners location. 

### What makes it different than a CRUD app? I.e., what functionality does it provide that is not just a user interface layer on top of a database of user information, and the ability to view / add to / change that information?
The application will be able to OAuth Spotify users and use the sporitfy API to access data from their accounts. Moreover, an additional API will be used to pull a map and vizualize the data. As of now likely a database will be used with predefined popularity of artists since Spotify is not exposing that API. 

### What security and privacy concerns do you expect you (as developers) or your users to have with this application?
It is likely that users may have concernes of their data/playlists or prviate information form their accounts shared/exposed. 

### Developer
Mariya Pasheva (UIN: 679604082)