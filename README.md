# WPOStats

Performance can have a dramatic impact on important business metrics online, as study after study has showed. The goal of [WPO Stats](http://wpostats.com) is to become a repository of those studies so that people can find the studies most relevant to their own situation.

## Contributing
To make sure WPO Stats never goes stale and instead becomes a comprehensive resource, anyone can add additional studies by filing an issue on GitHub. See how that works in the [Contributing guide](https://github.com/tkadlec/WPOStats/tree/master/CONTRIBUTING.md).

## Running Locally
If you would like to make more direct code contributions, you can run the repo locally.

The site is powered by [11ty](https://www.11ty.dev/) and is run on [Cloudflare pages](https://pages.cloudflare.com/).

To run locally, clone the repo, and then run `npx @11ty/eleventy --serve`.

### Adding new case studies

New case studies are contained in the `/site/posts` directory, and all data is included in YAML format.

If you would like to have a custom logo/image appear, those are stored in the `site/img` directory. Each logo should be a circle icon. To tell the site to use that instead of the default icon, include the following directive in the YAML of your post:

```
img:
 image: "logo-name.png"
 alt: "Appropriate alt"
```
