---
name: design-mastery
description: Comprehensive design partner covering graphic design, branding, typography, color theory, layout/composition, product & app UI-UX, and creative ideation. Use this whenever Precious is working on flyers, social graphics, brand identity, logos, app/website UI, design critique, mockup direction, or is stuck and needs fresh creative ideas. Trigger even when the word "design" isn't used explicitly — e.g. "make this flyer pop", "what colors should I use", "does this look professional", "help me brainstorm ideas for X", "critique my UI", "what fonts go together", or any OSPCN/TSDI/TMGM/portfolio visual work. Always consult this before giving color, font, layout, or creative-direction advice from memory alone — it has current, research-backed guidance and structured ideation techniques (SCAMPER, Crazy 8s, mind mapping) that beat generic suggestions.
---

# Design Mastery

A creative direction partner: part senior graphic designer, part UX lead, part ideation coach. The goal is never "here are some options" — it's a specific, justified point of view, the way a real design director would give it.

## How to use this skill

1. **Figure out what's actually being designed.** Flyer/social graphic? App or product UI? Brand identity/logo? A stuck creative-block moment? Each has a different reference file — read it before advising, don't wing it from general knowledge.
2. **Ground every choice in the brief**, not a generic default. Ask (briefly, in your own words, not as a checklist dump): who's it for, what's the one job this design has to do, and is there an existing brand/style to stay consistent with (e.g. Precious's "Gospel. Tech. Precious." brand, TMGM's warm photo-forward direction, OSPCN's peace-themed identity).
3. **Give one strong direction, not a menu.** Real design critique commits to a point of view and explains the reasoning, then offers 1-2 alternatives if relevant — it doesn't dump five options and ask the user to pick.
4. **Read the relevant reference file(s) below before giving specific technical advice** (exact hex codes, font pairings, spacing rules) — these encode current best practice, not just what's in training data.

## Reference files — read before advising in each domain

- `references/color-theory.md` — color wheel, harmony types (complementary/analogous/triadic), the 90/10 rule, psychology, accessibility/contrast
- `references/typography.md` — font pairing theory (contrast/hierarchy/cohesion), type scales, line length/height, hierarchy without extra fonts
- `references/layout-composition.md` — grid systems, visual hierarchy, white space, the rule of thirds, alignment, for flyers/posters/social graphics specifically
- `references/branding-identity.md` — logo/identity fundamentals, consistency across touchpoints, style guides, voice-and-visual alignment
- `references/ui-ux-principles.md` — 2026 UI/UX best practices: user-centricity, visible options over memory load, microcopy/error handling, journey mapping, accessibility
- `references/experience-motion-design.md` — **read this whenever an app/website/webapp needs to feel like an "experience" rather than a dashboard**: motion/animation principles (entrance, transition, feedback, perceived-reliability delays), Norman's visceral/behavioral/reflective levels, sound/haptics, moments of delight, and when to hold back on motion
- `references/creativity-ideation.md` — SCAMPER, Crazy 8s, mind mapping, Six Thinking Hats, breaking creative block, when to use which technique
- `references/ai-slop-checklist.md` — **read this before evaluating or writing prompts for any AI/vibe-coded UI output** (v0, Lovable, Bolt, Claude Design, etc.): the 16 concrete tells of "AI slop" design (Inter-everywhere, vibe-code purple, colored left borders, icon-card grids, glassmorphism, and more) and what to do instead

## Quick-fire creative unblock (use inline, no file read needed for a fast nudge)

When Precious is stuck or wants "peak ideas" fast, these three moves cover most situations — but read `references/creativity-ideation.md` for the full toolkit and when each shines:

- **Crazy 8s**: force 8 distinct directions in 8 minutes (mentally, or literally sketch 8 tiny thumbnails). Kills perfectionism, surfaces the idea that wouldn't have come from careful thinking.
- **SCAMPER**: take the current design/idea and run it through Substitute / Combine / Adapt / Modify / Put-to-other-use / Eliminate / Reverse. Best when iterating on something that already exists (a past flyer template, TMGM's current UI) rather than starting blank.
- **Constraint injection**: if too many options is the block, add an arbitrary constraint ("no photos, only typography" / "one color + black + white") — constraints usually produce more distinctive work than total freedom.

## Context-aware defaults for Precious's recurring work

- **OSPCN / TSDI flyers and social graphics** — peace/community themes, needs to read instantly at thumbnail size on WhatsApp/Instagram; check `layout-composition.md` for hierarchy-at-a-glance principles.
- **TMGM app UI** — warm, photo-forward direction already established; new screens should extend that system, not reinvent it. Check `ui-ux-principles.md` and stay consistent with prior TMGM design decisions.
- **preciouswrites / personal brand ("Gospel. Tech. Precious.")** — faith + tech + creative identity; typography and color choices should feel intentional, not templated (see the "avoid AI-default" note in `layout-composition.md`).
- **Portfolio/CV visual presentation** — clarity and hierarchy matter more than decoration; a hiring manager scans in seconds.
- **Any app/webapp that should feel like an "experience," not a dashboard** (TMGM, Makarios, Feelms) — read `references/experience-motion-design.md` before proposing UI; utility tools (Dabar, Privora, admin/internal screens) should stay fast and undecorated instead.

## Principles that apply everywhere (don't need the reference files for these)

- **Hierarchy over decoration.** Every design choice — color, size, weight, spacing — should tell the eye where to look first, second, third. If everything is emphasized, nothing is.
- **One dominant, others support.** A dominant color with restrained accents, one hero typeface with a quiet supporting face, one focal element per composition. Real designers spend their boldness in one place.
- **Constraints breed distinctiveness.** The three most common "AI-generated design" looks right now are: cream background + high-contrast serif + terracotta accent; near-black + single acid accent color; broadsheet/newspaper hairline-rule layout. All are legitimate choices, but only when chosen for a reason — not defaulted to. Actively push against them unless the brief calls for exactly that look.
- **Always screen AI/vibe-coded UI output against the slop checklist.** Any time a UI-gen tool (v0, Lovable, Bolt, Claude Design) has produced a draft, or a prompt is being written for one, read `references/ai-slop-checklist.md` first — it has 16 specific, checkable tells (fonts, colors, layout quirks, CSS fingerprints) rather than a vague "make it distinctive" instinct.
- **Design is communication first, decoration second.** Ask "what does this need to say, and to whom" before "what does this need to look like."
-e 

---

-e 

# Reference: ai-slop-checklist

# Avoiding AI Slop UI

"AI slop" design is the specific, recognizable visual fingerprint that generative tools default to when given vague direction ("make it modern," "make it clean"). None of these patterns are wrong individually — they're wrong when they appear together, unchosen, in every single output regardless of the actual brief.

A 2026 audit of 1,590 Show HN landing pages scored each against 16 concrete tells and found 22% were heavy slop (4+ patterns), 32% mild, and 46% clean. The most common single tell was permanent dark mode, followed by gradient backgrounds and icon-card grids. Worth running this checklist against anything an AI tool generates before shipping it — including v0, Lovable, Bolt, Claude, or Claude Design output.

## The 16 patterns to watch for

**Fonts**
1. Inter used for everything, especially the centered hero headline
2. The same recycled combos every time: Space Grotesk + Instrument Serif, or Geist everywhere
3. A serif italic used as the one "accent" word in an otherwise all-Inter page

**Colors**
4. "Vibe-code purple" — a specific lavender-purple that's become the LLM default accent
5. Permanent dark mode with medium-grey body text and all-caps section labels
6. Body text in dark themes that barely clears (or fails) accessible contrast
7. Gradients everywhere, used as decoration rather than for a reason
8. Large colored glows and colored box-shadows

**Layout quirks**
9. Centered hero set in a generic sans-serif
10. A badge positioned right above the hero headline
11. Colored borders on cards — almost always on the top or left edge (this one is the single most specific tell; once noticed, it's hard to unsee)
12. Identical feature cards, each with an icon on top, no variation
13. Numbered "1, 2, 3" step sequences used as a default explainer format
14. Stat-banner rows dropped in without being asked for
15. Sidebar or nav using emoji as icons
16. All-caps headings and section labels used throughout

**CSS/library fingerprints**
- shadcn/ui defaults left unmodified — the library is built to be copy-pasted by AI agents, so its out-of-the-box look leaks into everything unless customized (color tokens, radius, shadows, non-default variants)
- Glassmorphism (frosted-glass card treatment) as the reflexive "modern" choice

## Why this happens

Generative models sample high-probability, "safe" patterns from training data. Under vague direction, that means convergence on the same handful of looks — it's not an aesthetic judgment, it's pattern-matching on "what looks like a good UI" in the aggregate. The fix is the same in every case: replace vague direction ("modern," "clean") with explicit, specific constraints — exact hex values, exact named fonts, exact spacing units, and explicit negative rules for the patterns to avoid.

## What clean, non-slop output actually does instead

Three habits separate distinctive work from slop, regardless of tool:

1. **A palette that isn't the default.** Warm earth tones, high-contrast black-plus-one-bright-color, a cream-and-accent combo — anything with a specific point of view instead of the reflexive lavender-purple-on-dark.
2. **A type system that isn't Inter (or the recycled Inter-alternative combos).** Pick a display face and a body face deliberately, and make sure they're not both defaulting to the same "safe" choice.
3. **One strong layout primitive, repeated, instead of many different ones stacked together.** Not seven feature cards each with a different icon treatment, not step-sequence-plus-stat-banner-plus-emoji-sidebar all in the same page. One idea, executed consistently, becomes the page's actual signature.

An intentionally plain or even "ugly" design with a clear point of view reads as more considered than a polished page that triggers half the checklist above — polish without a point of view is exactly what makes slop recognizable.

## Applying this when reviewing AI-generated output for Precious's work

- **TMGM / portfolio / any vibe-coded UI**: before accepting a first draft from a UI-gen tool, run it against this list. A colored left border on cards or an unmodified shadcn card style is worth flagging immediately — see the redesign review pattern of catching "an accent color doing too much work" or "cards that all look the same."
- **When writing prompts for v0/Lovable/Bolt/Claude Design**: bake in explicit negatives up front — name the exact palette, name the exact fonts, and say plainly what NOT to default to (no purple accents, no Inter, no colored-left-border cards, no icon-grid feature sections) rather than hoping restraint happens on its own.
- **Follow-up passes**: if a generated draft already leans slop-y, don't just ask for "make it better" — name the specific pattern to remove (e.g. "drop the colored left border on the cards, tighten the icon-card grid into one repeated layout primitive instead").
-e 

---

-e 

# Reference: color-theory

# Color Theory

## The color wheel and harmony types

- **Complementary** — colors opposite each other on the wheel (red/green, orange/blue, yellow/purple). Maximum contrast, bold and attention-grabbing, but can vibrate/clash if used 50/50. **Use the 90/10 rule**: ~90% of one color, ~10% of its complement as accent (buttons, highlights, key CTAs).
- **Analogous** — colors that sit next to each other (red-orange-yellow, or blue-teal-green). Naturally harmonious, feels calm and cohesive ("like a sunset") — good for backgrounds, gradients, anything that needs to feel unified rather than punchy.
- **Triadic** — three colors evenly spaced around the wheel. Achieves both contrast and harmony at once; good when you need more than two colors but still want balance (e.g. a brand system with a primary, secondary, and accent).
- **Monochromatic** — tints/shades/tones of one hue. Safest for cohesion, good for minimal or professional-feeling work, but can feel flat without a contrasting neutral or one accent color.

## Practical hierarchy rule

Don't let colors fight for attention. Assign one dominant color, then sprinkle 1-2 accents. If everything is bold, nothing reads as important.

## Color psychology (use loosely, not as law)

Meanings shift by culture — always sanity-check against the actual audience, not just Western defaults.
- Red: urgency, passion, appetite, warning
- Blue: trust, calm, corporate/professional, tech
- Green: growth, peace, nature, "go/success," money (Western contexts)
- Yellow: optimism, energy, caution
- Purple: luxury, spirituality, creativity
- Orange/terracotta: warmth, friendliness, approachability (also currently the most over-used "AI-generated design" accent — use deliberately, not by default)
- Black/near-black backgrounds: premium, bold, tech-forward — but risk feeling generic if paired with a single acid-green/vermilion accent, which is a common templated look right now.

## Accessibility and contrast

- Text needs sufficient contrast against its background to be legible — as a rule of thumb, body text should look comfortably readable at a glance, not squint-inducing. When in doubt, darken/lighten until it's obviously fine, especially for anyone with low vision or colorblindness.
- Never rely on color alone to convey meaning (e.g. red text as the *only* signal of an error) — pair it with an icon, label, or other cue.
- ~8% of men and ~0.5% of women have some form of color blindness (most commonly red-green) — avoid relying on red/green distinctions alone for critical information.

## Applying to Precious's contexts

- **Flyers/social graphics**: pick one dominant brand-relevant color (e.g. peace-themed blues/greens for OSPCN) + one accent for the CTA or key detail. Resist the urge to use every color available "to look festive" — it usually reads as less professional, not more.
- **TMGM app UI**: stay within the established warm palette; introduce new colors only for functional purposes (success/error states) and keep them consistent with what's already shipped.
- **Personal brand**: a signature 2-3 color palette used consistently across the blog, LinkedIn, and X builds recognition over time — pick it once and stop re-deciding it per post.
-e 

---

-e 

# Reference: typography

# Typography

## The three principles of good font pairing

Every pairing should hit all three, from Swiss International Typographic Style theory (Müller-Brockmann):

1. **Contrast** — the fonts must differ enough (weight, structure, x-height) to create clear roles. Two similar geometric sans-serifs will feel redundant, not harmonious.
2. **Hierarchy** — one font should clearly lead (headings/display), the other should clearly support (body/reading).
3. **Cohesion** — despite the contrast, they should share *some* underlying quality (era, mood, proportion) so the pairing feels intentional, not random.

## The simple two-font system (works for 90% of projects)

- **Display font**: headlines, subheadings, navigation, buttons. Carries personality — can be distinctive or quirky.
- **Text font**: body copy, captions, metadata. Prioritizes readability — should be "invisible," so the reader absorbs content without noticing the type.
- Classic combo: serif heading + sans-serif body (or vice versa) — the structural contrast is obvious enough to create instant hierarchy.
- Within one font family, use weight variation (Regular/Medium/Semibold/Bold) to add more hierarchy levels without adding a third typeface.
- **Hard limit: max 2-3 typefaces per design.** Beyond that it reads as cluttered and unintentional.

## Hierarchy without new fonts

Hierarchy doesn't require new typefaces — size, weight, color, and spacing alone can establish it. The largest element on a page doesn't have to be the focal point; a smaller but well-placed and well-colored element can lead the eye just as effectively.

## Readability fundamentals

- Body text: ~16-18px for digital; comfortable, not squint-inducing.
- Line height (leading): 1.5-1.7x font size for body text.
- Line length: 50-75 characters per line is the readability sweet spot — much longer and the eye loses its place jumping back.
- Always test fonts with real content at actual display sizes, not just specimen previews — a font can look great as a headline mockup and fall apart at small sizes or on lower-res screens.

## Applying to Precious's contexts

- **Flyers**: one strong display face for the event name/headline, one clean sans-serif for details (date, time, venue) — resist adding a third "decorative" font just because Canva offers it.
- **TMGM UI**: typography should stay consistent across screens — same type scale, same weight system — so the app doesn't feel like it was designed screen-by-screen.
- **Blog (preciouswrites)**: web body text especially benefits from generous line-height and a 60-75 character line length for long-form faith/tech/film writing — readability matters more than a stylish font at that length.
-e 

---

-e 

# Reference: layout-composition

# Layout & Composition

## Visual hierarchy first

Before choosing colors or fonts, decide the order the eye should move through the design: what's noticed first, second, third. Size, contrast, color, placement, and white space are all tools for building that order — decorate only after the hierarchy is locked.

## Grid and alignment

- Everything should align to *something* — an invisible grid, a shared left edge, a center axis. Misaligned elements are the single fastest way a design reads as "unprofessional" even when the person can't say why.
- Grouping related elements closer together (and unrelated elements further apart) — proximity — does a lot of the organizing work for free.

## White space is a design element, not empty space

Cramming a flyer full "to use the space" almost always reads as amateur. Generous white space around a headline or key visual makes it look premium and makes the eye know where to rest. If in doubt, remove an element rather than add one — Chanel's advice applies to design too: before you're done, take one accessory off.

## Rule of thirds (for photo-based or asymmetric compositions)

Divide the canvas into a 3x3 grid; place key subjects/focal points near the intersection lines rather than dead-center. Creates more dynamic, less static compositions — useful for TMGM's photo-forward screens and event flyer hero images.

## Flyers/social graphics specifically

- Must read in under 2 seconds at thumbnail size (WhatsApp Status, Instagram feed) — the headline/event name needs to be the loudest thing on the page, not buried under a busy background image.
- One focal point per flyer. If there's a photo, a headline, a date, and a logo all competing for attention, pick which one wins and mute the rest.
- Leave breathing room at the edges — text or key info touching the crop line risks getting cut off on different platforms' aspect ratios.

## Avoiding the "AI-generated" tell

Three looks currently over-saturate AI-assisted design: (1) cream background + high-contrast serif + terracotta/warm-clay accent, (2) near-black background + single acid-green or vermilion accent, (3) broadsheet-style hairline rules with zero border-radius and dense newspaper columns. None of these are wrong — but defaulting to one without a brief-specific reason is what makes work look templated. Ground the palette and layout in the actual subject (the event, the brand, the person) instead.

For a more exhaustive, checkable list — specific fonts, colors, and layout patterns to screen any AI/vibe-coded UI output against — see `ai-slop-checklist.md`. Read that one before evaluating a draft that came out of v0, Lovable, Bolt, Claude Design, or similar tools.

## Applying to Precious's contexts

- **OSPCN/TSDI flyers**: one photo OR one strong graphic treatment, not both competing — headline (event name) biggest, then date/time, then logo/footer smallest.
- **TMGM screens**: maintain consistent spacing/grid rhythm across screens so the whole app feels like one system, not a patchwork of individually-designed pages.
- **Portfolio/CV**: generous white space and clear section grouping matter more than fitting everything on one page — a hiring manager scans, doesn't read densely.
-e 

---

-e 

# Reference: branding-identity

# Branding & Identity

## What a brand identity actually is

Not a logo — a consistent system: color palette, typography, voice, and visual motifs that make something recognizable across every touchpoint (social post, flyer, app screen, email) without needing a label to say whose it is.

## Core components

- **Logo** — should work at multiple sizes (from favicon to banner) and in a single color (test it in black-and-white before finalizing).
- **Color palette** — 2-4 primary/brand colors + 1-2 accents, chosen once and reused everywhere (see `color-theory.md`).
- **Typography system** — the same 1-2 typefaces across all materials (see `typography.md`).
- **Voice** — the tone of the words matters as much as the visuals; a peace-and-community org (OSPCN) and a faith-tech personal brand ("Gospel. Tech. Precious.") should each sound consistently like themselves across platforms.

## Consistency over novelty

The instinct to make each new flyer/post "fresh" often works against brand recognition. A recognizable system with small planned variations (a season's accent color, a campaign-specific graphic) beats reinventing the palette and fonts every time. Save real creative risk-taking for the signature moment of a design (a hero image, a unique motif) — not the underlying system.

## Style guide basics (even an informal one helps)

A one-page reference covering: primary/secondary colors with hex codes, 2 approved fonts, logo usage do's/don'ts, and 2-3 example layouts — saves re-deciding these choices every single time and keeps output consistent even months apart.

## Applying to Precious's contexts

- **"Gospel. Tech. Precious." personal brand**: worth locking in a small, consistent palette + 2 fonts used across the blog, X, and LinkedIn — recognition compounds over time when the visual identity doesn't shift post to post.
- **OSPCN**: as the graphics/social lead, a lightweight style guide (palette + fonts + logo rules) would make every future flyer faster to produce and more recognizably OSPCN's, even to someone who hasn't read the caption.
- **TMGM**: the app's warm, photo-forward direction is effectively the brand system already established — new features/screens should extend it, not introduce a competing visual language.
-e 

---

-e 

# Reference: ui-ux-principles

# UI/UX Principles (2026)

## User-centricity is the foundation

Design for what the real user needs, not what feels intuitive to the designer or what internal preference dictates. The classic example: the original upright ketchup bottle design made it hard to actually serve ketchup — it looked fine but failed the one job it had. Test assumptions against real usage, not gut feel alone.

## Minimize memory load — show options, don't make users recall them

Nielsen's classic heuristic, still central in 2026: visible choices beat requiring users to remember information. A dropdown with visible options beats a blank text field expecting users to know valid inputs. Search autocomplete beats a blank search bar. Recently-viewed lists beat expecting users to recall what they looked at.

## Journey mapping before wireframes

Before drawing a single screen, map the full journey a user takes to accomplish their goal — this surfaces friction points that aren't visible when designing screen-by-screen.

## Microcopy and error handling

Words are part of the interface. Buttons, labels, and instructions should use clear, concise, helpful language. Good error handling explains **what** went wrong, **why**, and **how to fix it** — not a vague "Something went wrong." Vague copy causes task abandonment and erodes trust; clear copy builds confidence.

## Accessibility and legibility

Sufficient text/background contrast, reasonable tap-target sizes, and support for assistive tech aren't optional extras — they determine whether the product actually works for a meaningful share of real users.

## Speed and first impressions

Users are impatient with abundant alternatives available. If a product doesn't feel right in the first few seconds, they leave — first-screen clarity and load speed carry outsized weight.

## The business case (for pitching stakeholders)

Every $1 invested in UX has been estimated (Forrester research) to return meaningfully more in downstream value — useful framing when advocating for design time/budget within a team or NGO context where design can be seen as "just decoration."

## Applying to Precious's contexts

- **TMGM app**: apply the "show, don't require recall" principle to any list/search screens; keep error messages in the app's warm, human voice rather than generic technical text; maintain the established visual system rather than reinventing per-screen (see `branding-identity.md`).
- **Feelms / Editorial Muse / personal projects**: journey-map the core flow (mood → movie recommendation; letter → delivery) before adding new screens, to catch friction before it's built.
- **TSDI/OSPCN digital touchpoints**: if building any form or tracker (e.g. SoulTrack), prioritize clear error/empty states in accessible, plain language — many users may have lower digital literacy, so clarity matters more than cleverness.
-e 

---

-e 

# Reference: creativity-ideation

# Creative Ideation Techniques

Different techniques suit different moments — matching the technique to the actual block matters more than picking a favorite.

## When starting from a blank page (divergent thinking)

- **Brainstorming** — free, spontaneous idea generation, no judgment yet. Best for wide-open problems with no existing starting point.
- **Mind mapping** — put the central concept in the middle, branch related ideas outward non-linearly. Best when the problem space is broad and you need to see relationships between ideas before narrowing focus. Tends to produce the most "market-acceptable," coherent results because of its structured, hierarchical nature.
- **Crazy 8s** — fold a page into 8 sections (mentally or literally), set a timer for 8 minutes, force one distinct idea/sketch per section. Kills perfectionism and analysis-paralysis by prioritizing quantity over polish; often the idea in box 6 or 7 (after the obvious ones are exhausted) is the interesting one.

## When iterating on something that already exists (convergent/transformative thinking)

**SCAMPER** — best when there's already a design, flyer template, or app screen to push further, rather than starting from scratch. Run the existing thing through each lens:
- **S**ubstitute — what element, material, or approach can be swapped out?
- **C**ombine — what two elements/features could merge into something new?
- **A**dapt — could this work if repurposed for a different audience or context?
- **M**odify — what if a key element were bigger, bolder, or made more extreme?
- **P**ut to another use — could this same asset/idea solve a different problem?
- **E**liminate — what could be removed entirely and still work — maybe better?
- **R**everse — what if the order, flow, or logic ran backwards?

## When a group needs to evaluate ideas fairly

**Six Thinking Hats** (Edward de Bono) — deliberately view an idea through 6 distinct lenses one at a time (facts, emotions, caution/risk, optimism, creative alternatives, process/control) rather than everyone arguing from their own instinct simultaneously. Useful when critiquing a design as a small team (e.g. with OSPCN or TSDI colleagues) to avoid the loudest opinion dominating.

## Breaking a genuine creative block

- **Constraint injection** — paradoxically, adding a constraint ("no photos, only type," "one color + black and white," "must fit in 5 words") usually produces more distinctive, interesting work than total freedom. Total freedom is often the actual source of the block.
- **Work from the content, not the template** — the most common failure mode of "AI-generated"-feeling design is starting from a generic layout and pouring content in. Instead, start from the one true, specific thing about *this* subject (the actual event, the actual verse, the actual person) and let the design grow from there.
- **Step away and return** — genuinely effective, not a cliché: ideation research consistently shows incubation periods (even short ones) improve idea quality on return.

## Applying to Precious's contexts

- **Stuck on a flyer design**: SCAMPER the last flyer that worked well rather than starting blank — Substitute the color story, Combine two past layouts, Reverse the visual hierarchy.
- **TMGM feature brainstorming**: mind map from the core user problem outward before jumping to UI details — this is where the Signal Protocol / storage-compression style architectural thinking already showed up well; the same "structure before detail" instinct applies visually too.
- **Personal brand content ideas**: Crazy 8s on "8 ways to visually represent 'Gospel. Tech. Precious.' this week" beats staring at a blank Canva canvas.
-e 

---

-e 

# Reference: experience-motion-design

# From Dashboard to Experience: Motion & Emotional Design (2026)

## The core distinction

A dashboard shows data. An experience makes someone *feel* something while they use it. The functional layer (does it work, is it clear) and the emotional layer (does it feel alive, does it feel like it was made with care) are separate design problems — most apps solve only the first. Norman's three levels are the useful lens:

- **Visceral** — the immediate gut reaction to how it looks/feels/sounds in the first second (colors, shapes, sound, motion).
- **Behavioral** — does it work well, is it usable, does it satisfy the task.
- **Reflective** — the lasting meaning/identity the person attaches to using it ("this app gets me").

Most "dashboard-feeling" apps nail behavioral and skip visceral + reflective entirely. Motion, sound, and moments of delight are how visceral and reflective get built — they're not decoration, they're the difference between "a tool I use" and "a thing I like using."

## Where motion earns its keep (2026 consensus)

Motion in 2026 has swung back from "flashy" to "purposeful" — the best designers now use it to communicate state, structure, and system intent rather than to impress. Ask "what does this movement communicate?" before adding it; if the answer is nothing, cut it.

- **Entrance animations** reveal structure — elements appearing in a logical sequence (not all at once) teaches the user the hierarchy of the screen without them consciously noticing.
- **Transition animations** bridge states — a modal sliding in from where it was triggered, a page fading rather than jump-cutting, keeps the user's mental model intact across navigation instead of feeling disorienting.
- **Feedback micro-animations** confirm actions registered — a checkmark animating in on a validated field, a button's subtle press-state, a cart icon reacting to an add — these are 200–500ms moments that reduce anxiety about whether the tap "worked."
- **Perceived-reliability animations** — counterintuitively, for high-stakes/infrequent actions (payment, password change, form submission), a brief deliberate delay before confirming can build *more* trust than instant success, because instant success on something important can read as "did that actually happen?" For high-frequency low-stakes actions (search, task-checking), speed should win instead — don't add delay there.
- **Motion as brand voice** — the physics of the animation (snappy and precise vs. bouncy and playful vs. slow and elegant) is itself a brand statement, the same way a font choice is. A fintech app's motion should feel different from a kids' edtech app's motion, deliberately.

## What to avoid

- Motion added because it's easy to add (a library default), not because it communicates something — this is the new "AI slop" of motion design.
- Overuse for users with vestibular sensitivity or attention differences — heavy parallax, constant bounce, or looping ambient motion should be reducible/toggleable, not mandatory.
- Animating everything at the same speed/style — if every interaction bounces the same way, nothing feels specifically meaningful; reserve the most expressive motion for the moments that matter most (task completion, milestones), not routine ones (list scrolls).
- Chasing "immersive" for its own sake (3D, parallax, scroll-hijacking) on a utility screen where speed and clarity matter more than spectacle.

## Building the "experience" layer beyond motion

Motion is one lever, not the whole answer. Others that turn a dashboard into an experience:

- **Moments of delight at emotionally-loaded points** — a small celebratory animation on completing something meaningful (not every action), a warm empty-state illustration instead of a blank "no data" screen, copy that sounds human at the moment someone finishes a task.
- **Sound and haptics** — a soft haptic thump on a toggle, a subtle sound on task completion — these make digital actions feel tangible, but should be sparing and dismissible.
- **Consistency as trust** — a defined "motion language" (consistent easing, duration, and style across the whole product) reads as intentional craft; inconsistent one-off animations read as bolted-on.
- **Reflective-level touches** — small personalization or identity moments (the product remembering something about the user, a screen that feels tailored) build the "this was made for me" feeling that keeps people attached, without being invasive about data use.

## Applying to Precious's projects

- **TMGM app (warm, photo-forward)** — the redesign direction already leans toward emotional/reflective design; motion should reinforce warmth (soft easing, gentle fades/slides, not snappy/mechanical timing) and reserve celebratory moments for meaningful faith-journey milestones, not routine navigation.
- **Makarios (affirmations app)** — this is an emotional/reflective-design product by nature. The moment someone opens an affirmation or generates a wallpaper is the emotionally-loaded moment worth a deliberate, unhurried animation; routine navigation (switching tabs) should stay fast and undecorated so it doesn't compete for attention.
- **Feelms (mood-based movie recommender)** — the mood-input step is the visceral first-impression moment; a recommendation "reveal" animation (rather than an instant list dump) fits, since the whole product's premise is emotional matching, not raw data browsing.
- **Dabar / Privora / internal tools** — these are legitimately dashboard/utility tools (sermon repurposing, thesis project). Here speed and clarity should win over motion — save polish for state changes (processing → done) rather than decorative flourishes, since the users' goal is getting through a task, not lingering in an experience.
- **preciouswrites blog** — reflective-level branding matters more than motion here; subtle, tasteful transitions (fade-in on scroll, considered hover states on links) support the "Gospel. Tech. Precious." identity without needing heavy animation.
-e 

---

