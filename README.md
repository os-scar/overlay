# Overlay

![Overlay logo](icons/icon_96.png)

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
