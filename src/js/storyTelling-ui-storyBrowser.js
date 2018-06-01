/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // a UI for listing and browsing stories
    fluid.defaults("sjrk.storyTelling.ui.storyBrowser", {
        gradeNames: ["sjrk.storyTelling.ui"],
        model: {
            // the list of stories to be browsed (actually just models)
            stories: {
                // This content is here to aid in work on styling/aesthetics
                // story1: {
                //     title: "First story about something",
                //     author: "First Author",
                //     tags: ["Heart","Book"],
                //     contentTypes: ["text","image"]
                // },
                // story2: {
                //     title: "Second story about other things",
                //     author: "Second Author",
                //     tags: ["Cats"]
                // },
                // story3: {
                //     title: "Third story to try out a different thumbnail image",
                //     tags: ["Dots","Yayoi Kusama"],
                //     thumbnailUrl: "/tests/img/obliterationroom.jpg"
                // },
                // story4: {
                //     title: "Fourth story",
                //     author: "Fourth Author"
                // },
                // story5: {
                //     title: "Fifth story",
                //     tags: ["Dots"],
                //     thumbnailUrl: "/tests/img/obliterationroom.jpg"
                // }
            }
        },
        selectors: {
            viewList: ".sjrkc-storyTelling-browser-stories",
            gridViewLink: ".sjrkc-storyTelling-browser-view-control-grid",
            listViewLink: ".sjrkc-storyTelling-browser-view-control-list"
        },
        events: {
            onGridViewRequested: null,
            onListViewRequested: null
        },
        listeners: {
            "onReadyToBind.bindGridViewRequest": {
                "this": "{that}.dom.gridViewLink",
                "method": "click",
                "args": ["{that}.events.onGridViewRequested.fire"]
            },
            "onReadyToBind.bindListViewRequest": {
                "this": "{that}.dom.listViewLink",
                "method": "click",
                "args": ["{that}.events.onListViewRequested.fire"]
            },
            "onListViewRequested.changeView": {
                "funcName": "sjrk.storyTelling.ui.storyBrowser.changeView",
                args: ["{that}", "viewList", false, "{that}.options.browserConfig.gridViewClassName"]
            },
            "onGridViewRequested.changeView": {
                "funcName": "sjrk.storyTelling.ui.storyBrowser.changeView",
                args: ["{that}", "viewList", true, "{that}.options.browserConfig.gridViewClassName"]
            }
        },
        browserConfig: {
            placeholderThumbnailUrl: "../img/icons/icon-globe.png",
            gridViewClassName: "grid"
        },
        components: {
            templateManager: {
                options: {
                    listeners: {
                        "onAllResourcesLoaded.renderTemplateOnSelf": {
                            funcName: "{that}.renderTemplateOnSelf",
                            args: ["{storyBrowser}.model", "{storyBrowser}.options.browserConfig"]
                        }
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBrowser.handlebars"
                    }
                }
            }
        }
    });

    sjrk.storyTelling.ui.storyBrowser.changeView = function (component, selector, showGrid, className) {
        if (showGrid) {
            component.locate(selector).addClass(className);
        } else {
            component.locate(selector).removeClass(className);
        }
    };

})(jQuery, fluid);
