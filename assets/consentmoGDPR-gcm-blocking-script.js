// Google Consent Mode integration script from GDPR/CCPA Compliance + Cookie Management App
window.isenseRules = {};
window.isenseRules.gcm = {
    hasInitialized: false,
    ads_data_redaction: false,
    url_passthrough: false,
    storage: { ad_storage: "granted", analytics_storage: "granted", functionality_storage: "granted", personalization_storage: "granted", security_storage: "granted", wait_for_update: 500 },
}
window.isenseRules.initializeGcm = function (rules) {
  let initialState = rules.initialState;
  let analyticsBlocked = initialState === 0 || initialState === 3 || initialState === 6 || initialState === 7;
  let marketingBlocked = initialState === 0 || initialState === 2 || initialState === 5 || initialState === 7;
  let functionalityBlocked = initialState === 4 || initialState === 5 || initialState === 6 || initialState === 7;

  let gdprCache = localStorage.getItem('gdprCache') ? JSON.parse(localStorage.getItem('gdprCache')) : null;
  if (gdprCache && typeof gdprCache.updatedPreferences !== "undefined") {
    let updatedPreferences = gdprCache && typeof gdprCache.updatedPreferences !== "undefined" ? gdprCache.updatedPreferences : null;
    analyticsBlocked = parseInt(updatedPreferences.indexOf('analytics')) > -1;
    marketingBlocked = parseInt(updatedPreferences.indexOf('marketing')) > -1;
    functionalityBlocked = parseInt(updatedPreferences.indexOf('functionality')) > -1;
  }
  
  isenseRules.gcm = {
    hasInitialized: true,
    ads_data_redaction: marketingBlocked && rules.redactData,
    url_passthrough: rules.urlPassthrough,
    storage: {
      ad_storage: marketingBlocked ? "denied" : "granted",
      analytics_storage: analyticsBlocked ? "denied" : "granted",
      functionality_storage: functionalityBlocked ? "denied" : "granted",
      personalization_storage: functionalityBlocked ? "denied" : "granted",
      security_storage: "granted",
      wait_for_update: 500
    },
  };
};

// Google Consent Mode - initialization start
window.isenseRules.initializeGcm({
  "id": "GTM-KSKGXRR",
  "analyticsId": "",
  "isActive": true,
  "customEvent": true,
  "securityStorageCategory": 0,
  "redactData": true,
  "urlPassthrough": true,
  "initialState": 1
})

/*
* initialState acceptable values:
* 0 - Set both ad_storage and analytics_storage to denied
* 1 - Set all categories to granted
* 2 - Set only ad_storage to denied
* 3 - Set only analytics_storage to denied
* 4 - Set only functionality_storage to denied
* 5 - Set both ad_storage and functionality_storage to denied
* 6 - Set both analytics_storage and functionality_storage to denied
* 7 - Set all categories to denied
*/

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
isenseRules.gcm.ads_data_redaction && gtag("set", "ads_data_redaction", isenseRules.gcm.ads_data_redaction);
isenseRules.gcm.url_passthrough && gtag("set", "url_passthrough", isenseRules.gcm.url_passthrough);
gtag("consent", "default", isenseRules.gcm.storage);