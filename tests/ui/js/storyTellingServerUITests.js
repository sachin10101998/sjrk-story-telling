/*
Copyright The Storytelling Tool copyright holders
See the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit, sjrk, sinon */

"use strict";

(function ($, fluid) {

    var mockServer;

    jqUnit.test("Test getParameterByName function", function () {
        var testCases = [
            { // test retrieval of set value from provided URL
                parameter: "testParameter",
                url: "testUrl?testParameter=testValue",
                expected: "testValue"
            },
            { // test retrieval of empty value from provided URL
                parameter: "testParameter",
                url: "testUrl?testParameter=",
                expected: ""
            },
            { // test retrieval of set value from falsy URL
                parameter: "testParameter",
                url: null,
                expected: null
            },
            { // test retrieval of null value from provided URL
                parameter: null,
                url: "testUrl?testParameter=testValue",
                expected: null
            },
            { // test retrieval of set value from page URL
                parameter: "testParameterFromUrl",
                url: "",
                expected: "testValue"
            },
            { // test retrieval of null value from page URL
                parameter: null,
                url: "",
                expected: null
            },
            { // test retrieval of empty value from page URL
                parameter: "emptyTestParameterFromUrl",
                url: "",
                expected: ""
            },
            { // test retrieval of missing value from page URL
                parameter: "testParameterNotInUrl",
                url: "",
                expected: null
            }
        ];

        jqUnit.expect(testCases.length);

        fluid.each(testCases, function (testCase, index) {
            if (index === 4) {
                sjrk.storyTelling.testUtils.setQueryString("testParameterFromUrl=testValue&emptyTestParameterFromUrl=");
            }

            var actualResult = sjrk.storyTelling.getParameterByName(testCase.parameter, testCase.url);
            jqUnit.assertEquals("Query string parameter '" + testCase.parameter + "' is retrieved as expected", testCase.expected, actualResult);
        });
    });

    fluid.defaults("sjrk.storyTelling.storyTellingServerUiTester", {
        gradeNames: ["fluid.modelComponent", "fluid.test.testCaseHolder"],
        baseTestCase: {
            clientConfig: {
                theme: "base",
                baseTheme: "base",
                authoringEnabled: true
            }
        },
        members: {
            clientConfig: {
                theme: "customTheme",
                baseTheme: "base",
                authoringEnabled: true
            }
        },
        modules: [{
            name: "Test Storytelling Server UI code",
            tests: [{
                name: "Test themed page loading functions with mock values",
                expect: 1,
                sequence: [{
                    funcName: "sjrk.storyTelling.storyTellingServerUiTester.setupMockServer",
                    args: ["/clientConfig", "{that}.options.baseTestCase.clientConfig", "application/json"]
                },{
                    task: "sjrk.storyTelling.loadTheme",
                    resolve: "jqUnit.assertDeepEq",
                    resolveArgs: ["The themed page load resolved as expected", "{that}.options.baseTestCase.clientConfig", "{arguments}.0"]
                },{
                    funcName: "sjrk.storyTelling.storyTellingServerUiTester.teardownMockServer"
                }]
            },{
                name: "Test themed page loading functions with server config values",
                expect: 3,
                sequence: [{
                    task: "$.get",
                    args: ["/clientConfig"],
                    resolve: "fluid.set",
                    resolveArgs: ["{that}", "clientConfig", "{arguments}.0"]
                },{
                    task: "sjrk.storyTelling.loadTheme",
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["The themed page load resolved as expected", "{that}.clientConfig.theme", "{arguments}.0.theme"]
                },{
                    funcName: "sjrk.storyTelling.storyTellingServerUiTester.verifyCustomCssLoaded",
                    args: ["{that}.clientConfig", 1]
                },{
                    task: "sjrk.storyTelling.loadCustomThemeFiles",
                    args: ["{that}.clientConfig"],
                    resolve: "sjrk.storyTelling.storyTellingServerUiTester.verifyCustomCssLoaded",
                    resolveArgs: ["{that}.clientConfig", 2]
                }]
            }]
        }]
    });

    sjrk.storyTelling.storyTellingServerUiTester.setupMockServer = function (url, clientConfig) {
        mockServer = sinon.createFakeServer();
        mockServer.respondImmediately = true;
        mockServer.respondWith(url, [200, { "Content-Type": "application/json"}, JSON.stringify(clientConfig)]);
    };

    sjrk.storyTelling.storyTellingServerUiTester.teardownMockServer = function () {
        mockServer.restore();
    };

    sjrk.storyTelling.storyTellingServerUiTester.verifyCustomCssLoaded = function (clientConfig, expectedCssInstanceCount) {
        if (clientConfig.theme === clientConfig.baseTheme) {
            expectedCssInstanceCount = 0; // if no custom theme is set, we actually expect zero custom files
        }

        var actualInstanceCount = $("link[href$=\"" + clientConfig.theme + ".css\"]").length;
        jqUnit.assertEquals("Custom theme CSS file is linked the expected number of instances", expectedCssInstanceCount, actualInstanceCount);
    };

    fluid.defaults("sjrk.storyTelling.storyTellingServerUiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyTellingServerUiTester: {
                type: "sjrk.storyTelling.storyTellingServerUiTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyTellingServerUiTest"
        ]);
    });

})(jQuery, fluid);
