/*
Copyright 2017-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    fluid.registerNamespace("sjrk.storyTelling.transforms");

    /* A transform to turn a delimited string into an array.
     * - "delimiter": the delimiter of terms within the given strings
     * - "trim": if true, trims excess whitespace from each term, otherwise no
     */
    fluid.defaults("sjrk.storyTelling.transforms.stringToArray", {
        "gradeNames": [ "fluid.standardTransformFunction", "fluid.multiInputTransformFunction" ],
        "inputVariables": {
            "delimiter": ",",
            "trim": true
        }
    });

    sjrk.storyTelling.transforms.stringToArray = function (input, extraInputs) {
        var sourceString = input,
            delimiter = extraInputs.delimiter(),
            trim = extraInputs.trim();

        return fluid.transform(sourceString.split(delimiter), function (tag) {
            if (trim) {
                return tag.trim();
            } else {
                return tag;
            }
        });
    };

    /* A transform to turn an array into a delimited string
     * Values can also be accessed via a specific object path relative to each term.
     * - "separator" (optional): the delimiter to be inserted between each term
     * - "trailingSeparator" (optional): flag to include the separator at the end
     * - "stringOnly" (optional): flag to allow only non-empty strings
     * - "path" (optional): an EL path on each item in the terms collection
     */
    fluid.defaults("sjrk.storyTelling.transforms.arrayToString", {
        "gradeNames": [ "fluid.standardTransformFunction", "fluid.multiInputTransformFunction" ],
        "inputVariables": {
            "separator": ", ",
            "trailingSeparator": false,
            "stringOnly": true,
            "path": ""
        }
    });

    sjrk.storyTelling.transforms.arrayToString = function (input, extraInputs) {
        var combinedString = "";
        var separator = extraInputs.separator(),
            trailingSeparator = extraInputs.trailingSeparator(),
            stringOnly = extraInputs.stringOnly(),
            path = extraInputs.path();

        fluid.each(input, function (term) {
            term = fluid.get(term, path);

            if (!stringOnly || (term && typeof term === "string")) {
                combinedString += term + (separator || "");
            }
        });

        if (!trailingSeparator) {
            combinedString = combinedString.substring(0, combinedString.lastIndexOf(separator));
        }

        return combinedString;
    };

    /* A transform which, given a collection and an index, will the value of the
     * collection at the specified index, or if that is not truthy, the index itself
     * - "component": the component with the collection
     * - "path": the EL path on the component where the collection resides
     * - "index": the index value to be checked
     */
    fluid.defaults("sjrk.storyTelling.transforms.valueOrIndex", {
        "gradeNames": [ "fluid.standardTransformFunction", "fluid.multiInputTransformFunction" ],
        "inputVariables": {
            "component": null,
            "path": null,
            "index": null
        }
    });

    // returns the value of a collection at a given index, or, failing that, the index itself
    sjrk.storyTelling.transforms.valueOrIndex = function (input, extraInputs) {
        var component = extraInputs.component();
        var path = extraInputs.path();
        var index = extraInputs.index();

        return fluid.get(component, path)[index] || index;
    };

})(jQuery, fluid);
