---
title: 5 Lessons Learned After 5 Million Downloads
description: Podman Desktop just crossed 5,000,000 downloads. Here are 5 lessons the team learned along the way.
slug: 5-million-lessons-learned
authors: [kyetter]
tags: [podman-desktop, 5-million, downloads, celebrate, community]
image: /img/blog/5million/banner.jpg
---

![Banner announcing 5 million downloads](/img/blog/5million/banner.jpg)

## Wooohooo 🎉

Podman Desktop just crossed **5,000,000 downloads**! Less than a year ago we were celebrating [3 million](/blog/3-million), and now we're humbled to be at 5 million. That kind of growth doesn't happen without a community pushing us, challenging us, and choosing us. Thank you.

Download numbers can easily become vanity metrics. So instead of just announcing one, we wanted to mark this milestone the way developers _actually_ like to celebrate: with a retro. Here's what came out of it.

## 1. Be flexible, but not too flexible

The container landscape hasn't stood still since Podman Desktop launched: new tooling, AI, and constant churn in integration points, to name a few. Our extension-based architecture made it easier to respond. Extensions like Apple Container and AI Lab let us adapt to the market without disrupting the core application, and that same extensibility lets users build their own extensions wherever we can't keep up.

But flexibility has limits. Early on, we relied on Docker extensions in our catalog. As those APIs kept shifting, and some platforms drifted toward closed-source models, we struggled to keep up. Our answer was to build and maintain our own extensions rather than depend on ones we couldn't control. Staying flexible turned out to mean staying independent.

## 2. Scaling breaks things

For us, that was telemetry. When usage was low, we could gather the data we needed about product use without paying much attention to cost. That granular data was a great way to track feature adoption and inform the roadmap. As we grew, the cost of collecting it, and how we'd structured it, caught up with us. We went back and rebuilt a leaner, more prioritized approach to gathering telemetry.

## 3. More is not always more

More downloads brought more contributions, more issues, and more pull requests. It didn't automatically bring more progress. Contribution volume is up, but not always the engagement or quality we need, and more contributions end up abandoned partway through. That means real time spent chasing authors for follow-up instead of shipping. The lesson: a community of intentional, well-scoped contributions matters more than raw volume.

## 4. Adoption doesn't always look the way you expect

It's tempting to assume that if you build a feature, people will use it. We've learned that isn't true. Building a great product is part strategic vision, part user feedback, and part enablement and awareness. We try to stay grounded in how the product is used today, while still leaving room to make strategic bets for the future.

## 5. Open source travels farther than you can see

The last lesson might be the most encouraging one. Building on open-source foundations has a compounding value: it lets a community grow around a project in ways a closed, corporate roadmap never could. Case in point, we've discovered large-scale corporate adoption of Podman Desktop that had been happening quietly, without any of us knowing about it beforehand.

Five million downloads isn't really about the number. It shows that people are picking up Podman Desktop and gives us more to learn about where and how they use it.

## What's next

We're bringing this retro to our [community call on Thursday, August 27](https://github.com/podman-desktop/community/issues/25), live, with room for questions and anyone who wants to celebrate with us.

From all of us on the Podman Desktop team, thank you for the downloads, the issues, the pull requests, the extensions, and the honest feedback that keeps teaching us these lessons. Here's to the next 5 million. 🚀
