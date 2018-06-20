/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // the data model of a text-type block
    fluid.defaults("sjrk.storyTelling.block.textBlock", {
        gradeNames: ["sjrk.storyTelling.block"],
        model: {
            blockType: "text",
            text: null,
            simplifiedText: null
        },
        modelRelay: {
            target: "contentString",
            singleTransform: {
                type: "sjrk.storyTelling.transforms.arrayToString",
                input: ["{that}.model.heading", "{that}.model.text"],
                separator: ". ",
                stringOnly: true
            }
        }
    });

})(jQuery, fluid);
