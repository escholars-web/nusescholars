# NUS DE Scholars website repo

Welcome to the NUS DE Scholars website repo! You may find our (WIP) site [here](https://nusescholars.vercel.app/).

## Getting started

To get started with the project, change directory to where you wish to store the project on your
system using the `cd` command. You may open your Command Prompt (Windows) or Terminal (Mac),
and type `cd` and drag-and-drop the directory that you wish to
add this project folder to, to your terminal.

# Clone the repository

Once in the right directory, run the following command:

```
git clone https://github.com/escholars-web/nusescholars
```

This will create a new folder called `nusescholars` in your directory. Open this directory with your favourite
IDE or text / code editor.

# Set up the requirements

This project involves NodeJS. You may install that [here](https://nodejs.org/en/download/prebuilt-installer)

Recommended installation mode: prebuilt installer

# Add the packages to your system

Using any terminal, ensure that you are in the project directory. You may use `cd` to change to the right directory.
Open the file and run the following commands **one by one**:

Mac / Linux:

```
chmod a+x ./requirements.sh
./requirements.sh
```

Windows:

```
git bash ./requirements.sh
```

This will set up the necessary packages that you need.

# Deploying

From `main`, with your changes saved:

```
npm run deploy -- "what you changed"
```

That formats the code, builds it locally, then commits and pushes to `main`. The push is
what deploys: GitHub Actions publishes to GitHub Pages and Vercel redeploys the same commit.
If the build fails, nothing is committed or pushed, so you fix it and run the command again.

The commit message is optional (`npm run deploy` on its own uses a dated one), and
`npm run deploy -- --skip-build "message"` skips the local build if you are in a hurry.

The command refuses to run from any branch other than `main` — for feature branches, push
the branch and open a pull request as usual.
