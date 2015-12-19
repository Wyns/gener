// VDED11389 at 21/09/2015 04:33:17
'use strict';
if (typeof veTagData === 'undefined') {
    var veTagData = (function () {
        var b,
            tag = document.getElementById('veConnect'),
            d = {
                journeycode: 'CA3B6658-A59E-408F-BF4A-067F8DEA4413',
                captureConfigUrl: 'drs2.veinteractive.com/CaptureConfigService.asmx/CaptureConfig',
                appsServicesUrl: 'appsapi.veinteractive.com',
                veHostDomain: '//config1.veinteractive.com',
                promoteLanding: 'promotelanding.veinteractive.local',

                captureConfig: {
  CaptureUrl: "drs2.veinteractive.com/CaptureConfigService.asmx/CaptureConfig",
  customerid: 7432,
  datareceiverurl: "drs2.veinteractive.com/DataReceiverService.asmx/DataReceiver",
  Forms: [
    {
      ChatAgentId: null,
      EmailOptOut: false,
      FormFields: [],
      FormId: 33208,
      FormTypeId: 2,
      FormURLs: [
        "hyperoptic.com/web/guest/availability-check"
      ],
      IdentifyAbandonmentOr: true,
      NumberIdentifiedFields: 0,
      Name: null,
      OptOuts: [],
      Paremeter: [
        {
          ParameterValue: "payment-order",
          Paremeter: "_availabilitycheck_WAR_availabilitycheckportlet_view"
        }
      ]
    },
    {
      ChatAgentId: null,
      EmailOptOut: false,
      FormFields: [
        {
          ClientFieldName: "[id='user.firstName']",
          DomEvent: "OnChange",
          FieldTypeName: "Raw",
          FormMappingId: 72338,
          HtmlAttributeTag: "Value",
          HtmlType: ":text",
          IdentifyAbandonment: false,
          isEmail: false,
          FormMappingTypeId: 1
        },
        {
          ClientFieldName: "[id='user.lastName']",
          DomEvent: "OnChange",
          FieldTypeName: "Raw",
          FormMappingId: 72339,
          HtmlAttributeTag: "Value",
          HtmlType: ":text",
          IdentifyAbandonment: false,
          isEmail: false,
          FormMappingTypeId: 1
        },
        {
          ClientFieldName: "[id='user.email1']",
          DomEvent: "DynamicActivity",
          FieldTypeName: "Raw",
          FormMappingId: 72341,
          HtmlAttributeTag: "Value",
          HtmlType: ":text",
          IdentifyAbandonment: false,
          isEmail: true,
          FormMappingTypeId: 2
        }
      ],
      FormId: 33213,
      FormTypeId: 1,
      FormURLs: [
        "hyperoptic.com/web/guest/availability-check"
      ],
      IdentifyAbandonmentOr: true,
      NumberIdentifiedFields: 0,
      Name: null,
      OptOuts: [],
      Paremeter: [
        {
          ParameterValue: "product-selection",
          Paremeter: "_availabilitycheck_WAR_availabilitycheckportlet_view"
        }
      ]
    }
  ],
  IdentifyAbandonmentOr: true,
  JourneyCode: "CA3B6658-A59E-408F-BF4A-067F8DEA4413",
  JourneyId: 9187,
  JourneyTimeOut: 1800,
  NumberIdentifiedFields: 0,
  OptOutField: 0
},
                /*
                 * The custom settings are based on the standard defined on Settings.js.
                 */
                settings: { domainsToIgnore: ['hyperoptic.com' ], consoleMessagesEnabled: false,
 elementsStoppingAppsOnClick: [ ],
 autocompleteInputsHandler: [ ],
 keywordsRegExp: [ { source: 'Example', regexp: / /, notSearchEngine: false, replaceCharactersBySpace: '-', storeSearchTerm: false, showNoProducts: false, ignoreCloses: false } ],
 cookies: { enabled: true , timeToLive: 60}
}
,

                /*
                 * Custom events that allow custom behavior per journey. The standard is defined on CustomEvents.js.
                 */
                customEvents: {},

                /*
                 * Criteria filters that are setup by tech team. The types of Criteria filters possible are:
                 *       * Personality - The matching of this criteria filters will defined the personality that the chat will have
                 *       * Variation
                 */
                criteriaFilters: {
  chat: [],
  assist: [],
  promote: []
},

                /*
                 * All the apps that Ve Interactive has with the events
                 */
                appsMappings: {},

                /*
                 * All the apps that Ve Interactive has with the events
                 */
                apps: [
  {
    name: "Chat",
    exit: true,
    inactivity: true,
    backButton: true,
    load: true,
    enabled: true,
    maxActivationsPerSession: null,
    activateOnlyOnLastTab: false,
    minTimeBetweenActivations: null,
    exitIntent: true
  }
]
            };

        if (!tag) {

            // Adding the Capture-apps file to the DOM
            tag = document.createElement('script');
            tag.type = 'text/javascript';
            tag.id = 'veConnect';
            tag.async = true;
            tag.src = window.location.protocol + d.veHostDomain + '/scripts/4.6/capture-apps-4.6.0.js';
            b = document.getElementsByTagName('script')[0];
            b.parentNode.insertBefore(tag, b);
        }
        return d;
    })();
};
