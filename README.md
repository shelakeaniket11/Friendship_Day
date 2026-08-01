# For You ❤️

A private, one-person Friendship Day website.

## Project structure

```
.
├── index.html              → the page markup
├── css/
│   └── style.css           → all styling
├── js/
│   └── script.js           → all interactions & animations
└── assets/
    └── audio/
        └── song.mp3         → put your background song here (see README inside)
```

## Adding your song

Drop an mp3 file into `assets/audio/` and name it `song.mp3`.
See `assets/audio/README.md` for details. The mute/unmute button in the
bottom-right corner of the site controls it — no other setup needed.

## Running it locally

Just open `index.html` in a browser. No build step, no server required.

(If your browser blocks the audio autoplay/scripts when opening the file
directly with `file://`, that's normal browser security — it'll still work
fine once deployed to GitHub Pages, since that serves over `https://`.)

## Deploying to GitHub Pages

1. Create a new GitHub repository (public or private — Pages works for both,
   though private repos need GitHub Pro/Team/Enterprise for Pages).
2. Upload this whole folder's contents to the repo (keep the folder structure —
   `index.html` at the root, `css/`, `js/`, `assets/` alongside it).
   - Easiest way: on the repo page, click **Add file → Upload files**, then
     drag the `index.html`, `css`, `js`, and `assets` folders in together.
3. Go to the repo's **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Pick the branch (usually `main`) and folder `/ (root)`, then **Save**.
6. GitHub will give you a live URL, usually:
   `https://<your-username>.github.io/<repo-name>/`
   It can take a minute or two to go live the first time.

That's it — every time you push changes to that branch, the live site updates
automatically.
