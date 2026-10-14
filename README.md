# Palak weds Nayan — #nayankipalak

Static wedding invitation, adapted from the supplied public mockup. The illustration style, envelope animation, gallery, and family closing are preserved. The names, monograms, wedding date, and event schedule are updated. Each event card includes its venue. RSVP and directions controls are removed.

## 14 October update

- The family closing now reads **Agrawal Family**.
- Each event card shows **Shree Path Villa, Amoda, Shirpur** for 9–10 December or **Madhuban Lawns, Agrawal Complex, Opp Bus Stand, Shirpur** for 11–12 December.
- The inline couple names use separate spans with explicit space around the ampersand. The welcome names also have more vertical space.
- All seven events have separate, lossless WebP illustrations, including the newer artwork on the published site. Images retain their native aspect ratios and are never stretched independently in width and height.
- The “Made for each other” gallery now uses all three supplied couple photos, preserved as the original JPEG files in `assets/couple/`. Portrait frames display the full photos without stretching or cropping; swipe, arrow, and dot controls switch between them.
- The music now uses the supplied `ReelAudio-9451.mp3`, saved unchanged as `assets/o-rangrez-instrumental.mp3`. The approximately 36-second clip starts when the guest opens the invitation, loops, and can be paused or resumed with the music button. Reopening the invitation resets playback. A new asset filename prevents the previous music from being reused from the browser cache.

## Confirmed schedule

All times are India Standard Time (Asia/Kolkata), in December 2026.

| Date | Event | Time |
| --- | --- | --- |
| 9 December | Kumkum | 11:30 AM |
| 10 December | Haldi | 10:00 AM |
| 10 December | Mehendi | 2:00 PM |
| 11 December | Baarat Swagat | 5:00 PM |
| 11 December | Sangeet | 7:00 PM |
| 12 December | Phera | **1:30 PM (afternoon)** |
| 12 December | Reception | 7:30 PM |

The Save the date link opens a Google Calendar draft for the all-day wedding date, 12 December 2026, at Madhuban Lawns, with the entire schedule and each event's venue in its description. The guest saves it in their own Google account. No calendar event is created automatically.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:4173/#nayankipalak`.

## Publish

Repository: https://github.com/clashhulk/nayankipalak

GitHub Pages publishes the `main` branch from the repository root. The public invitation address is https://clashhulk.github.io/nayankipalak/#nayankipalak once deployment succeeds. Commit and push future changes to `main` to publish an update. The `.nojekyll` file makes this a plain static site; no build command, database, environment variables, or server-side code is required.

The previous ChatGPT-hosted invitation is a separate deployment and is not updated by pushes to this repository.

For Vercel, import this repository, select Framework Preset **Other**, leave the Build Command blank, and use `.` as the Output Directory.

The local archive `nayankipalak-final.zip` (also available as `nayankipalak-site.zip`) contains the deployable website files, with `index.html` at its root. ZIP archives, screenshots, and unused original artwork are excluded from Git.

## Editing

Change the names, dates, times, and invitation copy in `content.js`. The monograms and social preview text are in `index.html`. The favicon is in `assets/favicon.svg`.

The active event artwork is in `assets/events/`. Haldi and Mehendi use distinct illustrations. The six three-panel scenes are split into their original 512 × 1024 panels; Mehendi retains its original 1024 × 1536 resolution. Conversion to WebP is lossless, with pixel equality verified against the source. The source PNGs remain in the workspace but are excluded from the deploy ZIP when unused.

## Verification

Final media checks passed: all three original couple photos load in portrait frames using `object-fit: contain`, the gallery changes photos, and the mobile layout has no horizontal overflow. The supplied MP3 loads successfully (36.284 seconds), starts on opening, and plays/pauses through the music control. Looping is enabled. No browser console errors were observed. The final ZIP includes the new music and all three photos; media bytes are checked against the supplied originals.

JavaScript syntax checks and browser inspection passed. All seven event images loaded and their rendered aspect ratios match their native ratios. The family text and explicit name spacing were checked, along with overflow on narrow and desktop layouts. No browser errors were observed. The earlier Google Calendar URL-parameter check passed, but its final screen remains unverified after a Google Workspace redirect was blocked by automatic browser approval.
