# OneClickDesigner — Unstitched Task

This is my submission for the Full Stack Engineering Intern take-home assignment.
OneClickDesigner is a mini Generation Studio where users can pick a design template, fill in the required details, and get a gallery of product mockups.
The form changes based on the schema provided by the backend, so the fields don't need to be hardcoded on the frontend. Once the user starts generation, the app simulates a 25-second process before showing the results.

![alt text](image.png)

## Getting Started
Want to run the project locally? Here's how to get it up and running.

### 1. Install the dependencies
Open the project folder in your terminal and run:

```
npm install
```

### 2. Set up the environment variables
You'll find an `.env.example` file inside both the `client/` and `server/` folders.

Create an `.env` file in each folder using the corresponding example file and fill in the required values.

The server runs on port `3000` by default, and the frontend connects to `http://localhost:3000`.

### 3. Run the project
From the root directory, run:

```
npm run dev
```
This starts both the frontend and backend.
Once they're running, head over to [http://localhost:5173](http://localhost:5173/) in your browser, and you're good to go!.

## Three Decisions I Made And Why.

### 1. Keeping the polling simple
For checking the status of a generation job, I went with recursive `setTimeout` instead of `setInterval`.
I didn't want multiple API requests piling up if one of them took longer than expected. With this approach, the next poll is scheduled after the current request finishes.
I also added a check for when the user switches browser tabs, so polling pauses while the tab isn't visible. It's a small detail, but it helps avoid unnecessary requests.

### 2. Figuring out the job status when needed
Instead of running timers in the background for every job, I made the backend calculate the current status whenever the job is requested.
It uses the time elapsed since the job was created to figure out whether it's queued, processing, in a particular stage, or completed.
I went with this approach because it keeps the backend logic straightforward and avoids having to manage a bunch of background timers.

### 3. Resizing images before uploading them
I added a small utility to resize images in the browser using `createImageBitmap` and an off-screen canvas.
The longest edge of the image is kept within 2048 pixels before it's uploaded. This helps reduce the amount of data being sent to the server and means the server doesn't have to handle the resizing itself.

## What I'd Change If I Had More Time
At the moment, jobs are stored in an in-memory `Map`. This works for the current implementation, but the data gets lost when the server restarts.
I'd like to replace it with a database such as PostgreSQL or MongoDB so that jobs can be saved properly.
I'd also explore using pre-signed URLs for image uploads. That way, images could be uploaded directly to cloud storage like AWS S3 instead of passing through the Express server first.

## Time Taken
Around 9–10 hours.

## Contact Details
**Sonal Sharma**

- Email: [sonalsharma2809@gmail.com](mailto:your-email@example.com)
- Phone: +91 8850292075
- GitHub: [Sonal-Sharma28](https://github.com/Sonal-Sharma28)
