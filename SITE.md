# Hunter Flynn – Site Memory

## Project
- Site: hunterflynn.com
- Stack: Next.js, TypeScript, Tailwind, App Router, src/ directory
- Deployed to Vercel

## Brand

### Colors
- Background: #000000
- Text: #FFFFFF
- No accent color. Black and white only.

### Typography
- Headlines: DIN Engschrift LT Pro Regular
- Body: Adobe Clean Regular (self-hosted from public/fonts/AdobeClean-Regular.otf)
- Adobe Fonts embed: https://use.typekit.net/vct8cdm.css
- Headline font must always be used at minimum 30% larger than body copy per label spec
- All headlines uppercase
- No em dashes anywhere in copy

### Logos
- Nav: public/logos/HunterFlynn_LogoName_White.png
- Footer: public/logos/HunterFlynn_LogoLocked_White.png
- Logos must never have a white background behind them
- Logos must be scaled proportionally, never stretched

### Voice
- Direct, unpolished, real
- No marketing language, no "rising star" clichés
- Quotes from Hunter are used verbatim, never paraphrased
- "Appalachian Soul" is his self-described genre — use it exactly

## Pages
- / (Home)
- /about (About)
- /music (Music)
- /shows (Shows)
- /booking (Booking)

## Nav
Home / Music / About / Shows / Booking
Logo links to /

## Videos
- Desktop hero: https://res.cloudinary.com/dgbiatexy/video/upload/v1782762637/RobbingABank_DesktopV2_lcmdl9.mp4
- Mobile hero: https://res.cloudinary.com/dgbiatexy/video/upload/v1782762637/RobbingABank_MobileV2_fytcod.mp4
- Music video: https://res.cloudinary.com/dgbiatexy/video/upload/v1782775383/RobbingABank_MusicVideo_ffzxhh.mp4
- YouTube videos (in order):
  1. https://www.youtube.com/watch?v=Qr6gisD81Yg (featured on home)
  2. https://www.youtube.com/watch?v=L09msLEDVNs
  3. https://www.youtube.com/watch?v=Tvd7PgeglDg
  4. https://www.youtube.com/watch?v=fBKRUlsaKzM
  5. https://www.youtube.com/watch?v=l5Uwx8XXrqo

## Singles
Newest first. Shown as a 2x2 grid on both / and /music.
- "You, Not Me" — releases August 21, 2026. Pre-save: https://hunterflynn.ffm.to/younotme.OWE
  Cover: public/covers/HunterFlynn_YouNotMe_cover.jpg (note the lowercase "cover" in the filename)
- "Dreams Keep Dying" — https://hunterflynn.ffm.to/dreamskeepdying.OWE
  Cover: public/covers/HunterFlynn_DreamKeepDying_Cover.jpg
- "Robbing A Bank" — released June 26, 2026. https://hunterflynn.ffm.to/robbingabank
  Cover: public/covers/HunterFlynn_RobbingABank_Cover.jpg
- "Wasted Day" — https://hunterflynn.ffm.to/wastedday
  Cover: public/covers/HunterFlynn_WastedDay_Cover.jpg

## Splash / Pre-Home Overlay
- Component: src/components/Splash.tsx, rendered as the first child of <body> in the root layout
- Shows once per browser session, gating every route except /legal
- Session key: hf_splash_younotme (sessionStorage). Bump the suffix when the
  campaign changes and the splash re-shows to everyone automatically. The same key is
  duplicated in src/app/layout.tsx for the pre-paint script, keep the two in sync
- Two <html> classes: splash-entered (clicked through) and splash-exempt (deep-linked to
  a legal page). Exempt visitors are NOT marked as entered, so reading the Terms is never
  treated as agreeing to them
- Layout is a single centered column: cover art, then title, then buttons
- Backdrop concept "the drawing behind the drawing": the same charcoal cover enlarged,
  blurred, and CSS-inverted, so the off-white paper drops to black and Hunter's graphite
  reads back as light. Texture asset is public/backgrounds/HunterFlynn_YouNotMe_Texture.jpg,
  a 900px downsample of the cover (114K) painted as a CSS background, not a next/image,
  since it is decorative and scaled well past its own resolution. Still black and white only
- When the campaign changes, re-crop the backdrop: background-size / background-position on
  .splash-backdrop-art are framed to the specific artwork, and opacity depends on how dark
  that drawing is (dark areas invert to bright ones)
- Consent flow follows client-sites/UNIVERSAL-LEGAL-PROMPT.md Step 4, same as marfa-site:
  - useSplashEntered() reports ONLY splash-entered, never splash-exempt. Entering is consent;
    an exempt legal page is just a hidden overlay
  - CookieConsent and the Case B TermsGate notice both wait on "entered", so a visitor
    reading the Terms pre-entry is not stacked with prompts
  - TermsGate Case A is the escape hatch: on /legal without having entered there is no
    "Enter Site" button anywhere, so the notice shows one. It calls markSplashEntered()
    and routes home. Always available, even after a past acknowledgement
  - The splash carries the arbitration / class-action notice under its buttons, with
    Terms, #section-17 and #class-action-waiver each linked separately

## Bio (Short — Home Page)
Hunter Flynn is a native to the Bluegrass state, born and raised in Pulaski County, Kentucky. Flynn's first public performance came in early 2022. Since then, the 28 year old singer/songwriter has gained national recognition as one of Appalachia's most promising young artists. In an area that has no shortage of talent, it is Flynn's soul-shattering vocal ability and veracious songwriting that makes him unique and leaves the listener with no doubt to whether or not he believes the songs he is singing. Flynn has now shared stages with the likes of Zach Top, Megan Moroney, Josh Meloy, and more. The sky is the limit for this young artist who refers to his style of music as "Appalachian Soul."

## Bio (Full — About Page)
Same as short bio above, followed by:

### A Second Chance at Life
"This whole thing was jump started by a near death experience when I flipped my old '99 4Runner 3 times across all three lanes of traffic on i75 in the summer of 2021. It forced me to realize that our time here is short and precious, and that I didn't want to waste another second of the time I had left doing something I didn't love. I ended up quitting my day job soon after and started doing commissioned charcoal portraits to make ends meet. In my free time I started going to open mics, and eventually worked up enough nerve to sing some of the songs I'd wrote. I got offered my first gig in February of 2022 and after that I knew that I'd found what I wanted to do for the rest of my life."

### Looking Ahead
"I want to leave something behind that I am proud of. I want to see the corners of the world. To laugh, cry, and love with every fiber of my being. I can only hope, when it's all said and done, that my songs reflect that."

### Visual Art
Before Hunter was ever a touring musician, he was trained in visual arts at Eastern Kentucky University and specializes in hyperrealism charcoal drawings. Charcoal on paper. 9 pieces. (PLACEHOLDER — photos needed from client)

## Shows
- Bandsintown artist ID: 15543032
- Bandsintown URL: https://www.bandsintown.com/a/15543032-hunter-flynn
- Current state: No upcoming shows. Display "No upcoming shows. Check back soon."

## Booking
BOOKING INQUIRIES:
Lance Roberts | WME | 615.963.3088 | LRoberts@WMEAgency.com
Geoff Turner | WME | 615.963.3366 | GTurner@WMEAgency.com

ARTIST MANAGEMENT:
MJ | 615.981.0202 | bookhunterflynn@gmail.com

## Subscribe Form
Fields: Email, Phone Number, Zip Code, Country (dropdown, United States first)
Integrations: Laylo + Mailchimp (wired in a later prompt)

## Socials
- Facebook: https://www.facebook.com/HunterFlynnMusic
- Instagram: https://www.instagram.com/h_nterflynn
- TikTok: https://www.tiktok.com/@hunter_flynn
- YouTube: https://www.youtube.com/@hunterflynn

## Footer
- Logo: HunterFlynn_LogoLocked_White.png
- Copyright: Copyright © 2026 Hunter Flynn Music - All Rights Reserved.
- Secondary line: © Borchetta Entertainment Group, LLC d/b/a Big Machine Records
- Links: Terms | Do Not Sell My Personal Information | Privacy | Cookie Choices
- (Footer links are placeholders — pages TBD)

## Assets in /public
- /public/backgrounds/HunterFlynn_Background_V1.jpg
- /public/backgrounds/HunterFlynn_Background_V2.jpg
- /public/backgrounds/HunterFlynn_Background_V3.jpg
- /public/backgrounds/HunterFlynn_Background_V4.jpg
- /public/covers/HunterFlynn_RobbingABank_Cover.jpg
- /public/covers/HunterFlynn_WastedDay_Cover.jpg
- /public/fonts/AdobeClean-Regular.otf
- /public/logos/HunterFlynn_LogoLocked_Black.png
- /public/logos/HunterFlynn_LogoLocked_White.png
- /public/logos/HunterFlynn_LogoName_Black.png
- /public/logos/HunterFlynn_LogoName_White.png

## Design Rules
- Black background everywhere (#000000)
- White text only (#FFFFFF)
- No gradients, no color accents, no decorative borders
- No pill buttons — use flat rectangular buttons, white border or white fill with black text
- No Lucide icons in colored circles
- No card grids with drop shadows
- Typography sets the visual hierarchy, not color or decoration
- All section backgrounds are black unless a full-bleed image or video overrides it
