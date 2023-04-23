[![Badge Commits]][Commit Rate]
[![Badge Issues]](https://github.com/os-scar/overlay/issues)
[![Badge License]](https://github.com/os-scar/overlay/blob/master/LICENSE.txt)
[![Badge Version]](https://github.com/os-scar/overlay/releases)
[![Badge Mozilla]](https://addons.mozilla.org/addon/overlay/)
[![Badge Chrome]](https://chrome.google.com/webstore/detail/overlay/fahpefingaaldhifdbnlipfjniabkiho)

---

<h1 align="center">
<sub>
<img src="icons/icon_48.png" height="38" width="38">
</sub>
Overlay
</h1>

<p align="center">
<a href="https://addons.mozilla.org/addon/overlay/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get Overlay for Firefox"></a>
<a href="https://chrome.google.com/webstore/detail/overlay/fahpefingaaldhifdbnlipfjniabkiho"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get Overlay for Chromium"></a>
<!-- <a href="https://microsoftedge.microsoft.com/addons/detail/overlay/xxxxxxxxxxxxxxxxxx"><img src="https://user-images.githubusercontent.com/585534/107280673-a5ece780-6a26-11eb-9cc7-9fa9f9f81180.png" alt="Get Overlay for Microsoft Edge"></a>
<a href="https://addons.opera.com/extensions/details/overlay/"><img src="https://user-images.githubusercontent.com/585534/107280692-ac7b5f00-6a26-11eb-85c7-088926504452.png" alt="Get Overlay for Opera"></a> -->
</p>

---

Overlay is a browser extension that helps developers evaluate open source packages before picking them. It gathers data from various sources, such as [Snyk Advisor](https://snyk.io/advisor/), [Debricked](http://debricked.com/select/), [Openbase](https://openbase.com/), [Socket.dev](http://socket.dev/), and [Deps.dev](https://deps.dev/), and displays them on the package pages of popular registries like [npm](https://www.npmjs.com/), [PyPI](http://pypi.org/), and [Go](https://pkg.go.dev/).

![Overlay Screenshot](https://user-images.githubusercontent.com/17686879/233840234-17550261-20c2-42f7-a096-c1ae106275c5.png)

With Overlay, you can quickly consider packages based on metrics like popularity, quality, security, maintenance, and compatibility. You can also see detailed information about each package, such as its license, dependencies, vulnerabilities, issues, releases, and more.

Overlay aims to help developers make informed decisions when choosing open source packages for their projects.

## Installation

Overlay is available for Chrome and Firefox. You can install it from the following links:

- [Chrome Web Store](https://chrome.google.com/webstore/detail/overlay/fahpefingaaldhifdbnlipfjniabkiho)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/overlay/)

## Usage

After installing Overlay, you can use it on any supported page (such as StackOverflow). You will notice indicators on package names and links, showing the number of issues. When you hover over an indicator, you will see more details about the package. You can also click on the indicator to open a modal with even more details.

![Overlay real screenshot](https://user-images.githubusercontent.com/17686879/233840747-012285c3-8aaf-4f7e-b99f-8946270a2e12.png)

You can customize the sources that Overlay uses by clicking on the Overlay logo in the extensions bar.

## Technical details

Overlay is written in Vue.js and uses a **background script** to fetch package data from various external sources.  
It injects the **indicator** as a _WebComponent_ into the current web pages and uses a **popup menu** to control the displayed sources.

## Feedback

We would love to hear your feedback and suggestions on how to improve Overlay. You can contact us by:

- Creating an issue on our [GitHub repository](https://github.com/os-scar/overlay/issues) for bugs and features
- Joining our [GitHub discussion](https://github.com/os-scar/overlay/discussions) for questions and ideas
- Participating in our [Discord channel](https://discord.com/channels/xxxx/xxxx)

## Contribution

We welcome contributions from anyone who wants to help us improve Overlay. If you are interested in contributing, please fork this repository and make your changes. Then submit a pull request with a clear description of your changes and why they are needed. We will review your pull request and merge it if it meets our standards.

Please make sure to follow our code style and conventions.

If you have any questions or suggestions about contributing, please feel free to contact us.

## License

Overlay is licensed under the MIT license. See the [LICENSE](https://github.com/os-scar/overlay/blob/master/LICENSE.txt) file for more details.

<!----------------------------------[ Badges ]--------------------------------->

[Badge Commits]: https://img.shields.io/github/commit-activity/m/os-scar/overlay?label=Commits
[Badge Mozilla]: https://img.shields.io/amo/rating/overlay?label=Firefox
[Badge License]: https://img.shields.io/badge/License-MIT-blue.svg
[Badge Chrome]: https://img.shields.io/chrome-web-store/rating/fahpefingaaldhifdbnlipfjniabkiho?label=Chrome
[Badge Issues]: https://img.shields.io/github/issues/os-scar/overlay
[Badge Version]: https://img.shields.io/github/v/release/os-scar/overlay
