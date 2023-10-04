[![Badge Commits]][Commit Rate]
[![Badge Issues]][Issues]
[![Badge License]][License]
[![Badge Version]][Releases]
[![Badge Mozilla]][Mozilla]
[![Badge Chrome]][Chrome]
[![Badge Discord]][Discord]

---

<h1 align="center">
Overlay
</h1>

Overlay is a browser extension that helps developers evaluate open source packages before picking them. It gathers data from various sources, such as [Snyk Advisor](https://snyk.io/advisor/), [Debricked](http://debricked.com/select/), [Socket.dev](http://socket.dev/), and [Deps.dev](https://deps.dev/), and displays them on the package pages of popular registries like [npm](https://www.npmjs.com/), [PyPI](http://pypi.org/), and [Go](https://pkg.go.dev/).

<p align="center">
<a href="https://addons.mozilla.org/addon/overlay/">
  <img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get Overlay for Firefox">
</a>
<a href="https://chrome.google.com/webstore/detail/overlay/fahpefingaaldhifdbnlipfjniabkiho">
  <img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get Overlay for Chromium">
</a>
<!-- <a href="https://microsoftedge.microsoft.com/addons/detail/overlay/xxxxxxxxxxxxxxxxxx"><img src="https://user-images.githubusercontent.com/585534/107280673-a5ece780-6a26-11eb-9cc7-9fa9f9f81180.png" alt="Get Overlay for Microsoft Edge"></a>
<a href="https://addons.opera.com/extensions/details/overlay/"><img src="https://user-images.githubusercontent.com/585534/107280692-ac7b5f00-6a26-11eb-85c7-088926504452.png" alt="Get Overlay for Opera"></a> -->
</p>

#### Platinum Sponsors

<p align="center">
  <a href="https://checkmarx.com" target="_blank">
    <img src="https://user-images.githubusercontent.com/17686879/243669103-bc424872-a5d0-4a43-ae3c-dc7610b39449.png" width="200" valign="middle" />
  </a>
  <a href="https://illustria.io" target="_blank">
    <img src="https://user-images.githubusercontent.com/17686879/243671181-6f392213-9a5f-456e-bf1e-d5b408376c69.png" width="200" valign="middle" />
  </a>
</p>

#### Gold Sponsors

<p align="center">
  <a href="https://www.citi.com" target="_blank">
    <img src="https://user-images.githubusercontent.com/17686879/243669917-022de069-ecbb-434e-927d-7add28d3096b.png" valign="middle" />
  </a>
  <a href="https://www.facebook.com/profile.php?id=100091498724349" target="_blank">
    <img src="https://user-images.githubusercontent.com/17686879/243670051-73f4c257-5fe5-4278-9db2-94db39bd9bda.png" valign="middle" />
  </a>
</p>

---

![Overlay Screenshot](https://user-images.githubusercontent.com/17686879/233840234-17550261-20c2-42f7-a096-c1ae106275c5.png)

With Overlay, you can quickly consider packages based on metrics like popularity, quality, security, maintenance, and compatibility. You can also see detailed information about each package, such as its license, dependencies, vulnerabilities, issues, releases, and more.

Overlay aims to help developers make informed decisions when choosing open source packages for their projects.

### Currently supported

- **Websites:** [StackOverflow](https://stackoverflow.com/questions/29461831), [npmjs.com](https://www.npmjs.com/package/node-sass) and [pypi.org](https://pypi.org/project/requests/) (see [Issue #14](https://github.com/os-scar/overlay/issues/14) for future plans)
- **Registries:** NPM, PYPI and Go (only on `pkg.go.dev`)
- **Advisories:** [Debricked](https://debricked.com/select/), [Snyk](https://snyk.io/advisor/), [Socket](http://socket.dev/) and [DepsDev](https://deps.dev/)

## Installation

Overlay is available for Chrome and Firefox. You can install it from the following links:

- [Chrome Web Store][Chrome]
- [Firefox Add-ons][Mozilla]

## Usage

After installing Overlay, you can use it on any supported page (such as StackOverflow). You will notice indicators on package names and links, showing the number of issues. When you hover over an indicator, you will see more details about the package. You can also click on the indicator to open a modal with even more details.

https://user-images.githubusercontent.com/1287098/234654340-8300c983-1a01-41fd-84f5-4a6a37cf98a8.mp4

You can customize the sources that Overlay uses by clicking on the Overlay logo in the extensions bar.

## Feedback

We would love to hear your feedback and suggestions on how to improve Overlay. You can contact us by:

- Creating an issue on our [GitHub repository][Issues] for bugs and features
- Joining our [GitHub discussion][Discussions] for questions and ideas
- Participating in our [Discord channel][Discord]

## Contribution

We welcome contributions from anyone who wants to help us improve Overlay. If you are interested in contributing, please fork this repository and make your changes. Then submit a pull request with a clear description of your changes and why they are needed. We will review your pull request and merge it if it meets our standards.

Please make sure to follow our code style and conventions.

If you have any questions or suggestions about contributing, please feel free to contact us.

### Technical details

Overlay is written in Vue.js and uses a **background script** to fetch package data from various external sources.  
It injects the **indicator** as a _WebComponent_ into the current web pages and uses a **popup menu** to control the displayed sources.

### Local Development

To start developing the extension locally, follow these steps:

1. Clone the project from the repository.
1. Install the dependencies securely with `yarn setup`.
1. In one terminal, run `yarn build:watch`. This will rebuild the extension every time you change a file.
1. In another terminal, run `yarn start:chrome` (or `yarn start:firefox`). This will reload the extension on the development browser every time the extension is built.

You can now test and debug the extension on _Chrome_ or _Firefox_.

#### Testing

To run unit tests, use `yarn test`. We use [Jest](https://jestjs.io/) for testing.

For end-to-end tests, see the [e2e/README.md](e2e/README.md) file.

### Resources

- A YouTube video for the [Ma'akaf community](https://discord.gg/fyZ8A5nb) about [how to start to contribute to this project](https://youtu.be/OnxaCXPAWAs) (in Hebrew).

### Contributors

- https://www.linkedin.com/in/baruchiro/
- https://www.linkedin.com/in/jossef/
- https://www.linkedin.com/in/guy-nachshon-17ba80198/
- https://www.linkedin.com/in/bar-lanyado-bb50b3110/
- https://www.linkedin.com/in/bogdan-kortnov-58996b213/
- https://www.linkedin.com/in/uriklar/
- https://www.linkedin.com/in/elad-tal-0355531b7/
- You?

## License

Overlay is licensed under the MIT license. See the [LICENSE][License] file for more details.

<!---------------------------------[ Links ]-------------------------------->

[Commit Rate]: https://github.com/os-scar/overlay/commits/master
[Issues]: https://github.com/os-scar/overlay/issues
[Discussions]: https://github.com/os-scar/overlay/discussions
[License]: https://github.com/os-scar/overlay/blob/master/LICENSE.txt
[Releases]: https://github.com/os-scar/overlay/releases
[Mozilla]: https://addons.mozilla.org/addon/overlay/
[Chrome]: https://chrome.google.com/webstore/detail/overlay/fahpefingaaldhifdbnlipfjniabkiho
[Discord]: https://discord.gg/dKhxnSmnBB

<!----------------------------------[ Badges ]--------------------------------->

[Badge Commits]: https://img.shields.io/github/commit-activity/m/os-scar/overlay?label=Commits
[Badge Mozilla]: https://img.shields.io/amo/users/overlay?label=Firefox
[Badge License]: https://img.shields.io/badge/License-MIT-blue.svg
[Badge Chrome]: https://img.shields.io/chrome-web-store/users/fahpefingaaldhifdbnlipfjniabkiho?label=Chrome
[Badge Issues]: https://img.shields.io/github/issues/os-scar/overlay
[Badge Version]: https://img.shields.io/github/v/release/os-scar/overlay
[Badge Discord]: https://img.shields.io/discord/1072162311369936946?logo=discord
