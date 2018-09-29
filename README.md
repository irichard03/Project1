# Project1 - Tempo

This will be a music site, combining the Spotify API with the Beats Per Minute API to create playlists and insert into the user's Spotify account.  The user will select a mood or activity from a pre-defined list and some favorite artists.  The BPM API will find songs by these specific artists and will give us the BPM of the songs.  The songs will be filtered based on beats per minute against a pre-set range of BPM for each mood/activity the app lists.  This info will then be sent to the Spotify API to create a playlist and insert into the user's account.  These lists can be created by artist, mood, genre, etc.

## API Info

[BPM API](https://getsongbpm.com/api)
[Spotify API](https://developer.spotify.com/documentation/web-api/)

We will use Firebase to store user preferences such as favorite genres and artists with basic authentication (e-mail)

## Stretch Goal

Using IBM Watson to determine a user's mood based on a paragraph about their day or how they feel and create playlist based on Watson's determination.
