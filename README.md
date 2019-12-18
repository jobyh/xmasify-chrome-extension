# Christmasify Chrome Extension

A bit of fun for the [Codebar](https://codebar.io/) Brighton chapter Christmas show and tell on December 17th 2019.
Add some Christmas tat to any website. Includes animated snowfall and boughs of holly.

I've provided plenty of comments in the source code if you're interested in having a rummage.

Note that there are two JavaScript files for this extension: `content.js` and `background.js`
which communicate via messages due to the way the Chrome extension API works.

Enjoy!

## Installing locally for development or larks

Clone this repository into your local workspace:

```
$ git clone https://github.com/jobyh/xmasify-chrome-extension.git
```

Open up Chrome, paste `chrome://extensions` into the address bar and hit enter.
Toggle on Developer mode in the top right.

![The Developer mode toggle switch](/docs/images/dev-mode-toggle.png)


You should see a button labelled **Load unpacked**. Click that and
open the directory you just cloned in the dialog which pops up.

![Load unpacked button](/docs/images/load-unpacked-button.png)


The extension should now appear in the listing. Lastly enable the plugin
using the toggle switch. You should now see the icon in your browser bar.

![Plugin listing for Christmasify](/docs/images/plugin-listing.png)

Go make it snow! ☃

## License

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.txt)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
