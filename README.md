# Christmasify Chrome Extension

A bit of fun for the [Codebar](https://codebar.io/) Brighton chapter Christmas show and tell on December 17th 2019.
Add some Christmas tat to any website. Includes animated snowfall and boughs of holly.

I've provided plenty of comments in the source code if you're interested in having a rummage.

Note that there are two JavaScript files for this extension: `content.js` and `background.js`
which communicate via messages due to the way the Chrome extension API is architected.

Enjoy!

## Installing locally for development

Clone this repository into your local workspace:

```
# Using your Github account
$ git clone git@github.com:jobyh/xmasify-chrome-extension.git

# ...or https as the repo is publicly accessible
$ git clone https://github.com/jobyh/xmasify-chrome-extension.git
```

Open up Chrome, paste `chrome://extensions` into the address bar and hit enter.
You should see a button labelled &lsquo;Load unpacked&rsquo; click that and
open the directory you just cloned in the dialog which follows.

The extension should now appear in the listing. Lastly enable the plugin
using the toggle switch.

## License

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
