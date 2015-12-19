var __fs_configuration_proxy, __fs_dncs, __fs_dncs_instance;

__fs_configuration_proxy = function (instance) {
    this._instance = instance;
    this._proxyId = 0x01;

    this.push = function (arrParameter) {
        this._instance.parseConfiguration(arrParameter[0], arrParameter[1]);
    };
};

__fs_dncs = function () {
    this._advid = {};
    this._allAdvid = {};
    this._stradvid = '';
    this._shard = false;
    this._cookieDomain = false;
    this._parameterString = '';
    this._spans = [];
    this._numbers = [];
    this._classNames = ['fs-dynamic-number'];
    this._loadEventTriggered = false;
    this._formattingFunction = function(s1, s2) { return s1; };
    this._numberReplacedListeners = [];
    this._numberConfigurations = {};
    this._alternativeNumbers = {};
    this._parameters = {'numberDetection':true};
    this._configurationFrozen = false;
    this._cbwConfiguration = {};
    this.keyStr="ABCDEFGHIJKLMNOP"+"QRSTUVWXYZabcdef"+"ghijklmnopqrstuv"+"wxyz0123456789-_"+"=";
    this._defaultCookies = ['__utma','__utmz','_ga','WT_FPC','xtidc','__fsComscoreCookie'];
    this._p_s_parameters = ['__sess','__uid','__vdf','xtsd','xtsite','xtp'];
    this._altAnsNums = '';
    this._loadModel = 'onload';
    this._waitFor = false;
    this._getNumberEventTag = '';
    this._spa = {
        referrer: null,
        urlHistory: []
    };

    this.readConfigurationBundle();

    if (this.getParameter("autoInvoke", true) && this._waitFor === false) {
        this.addLoadEvent(function() { 
            __fs_dncs_instance.loadEvent();
        });
    }
};

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

__fs_dncs.prototype = {
    base64_encode: function (input) {
        var output="";
        var chr1,chr2,chr3="";
        var enc1,enc2,enc3,enc4="";
        var i=0;
        input = unescape(encodeURIComponent(input));
        do {
            chr1=input.charCodeAt(i++);
            chr2=input.charCodeAt(i++);
            chr3=input.charCodeAt(i++);
            enc1=chr1>>2;
            enc2=((chr1&3)<<4)|(chr2>>4);
            enc3=((chr2&15)<<2)|(chr3>>6);
            enc4=chr3&63;
            if (isNaN(chr2)) {
                enc3=enc4=64;
            } else if (isNaN(chr3)) {
                enc4=64;
            }
            output=output+this.keyStr.charAt(enc1)+this.keyStr.charAt(enc2)+this.keyStr.charAt(enc3)+this.keyStr.charAt(enc4);
            chr1=chr2=chr3="";
            enc1=enc2=enc3=enc4="";
        } while(i<input.length);
        output=output.replace(/=/g,"");
        return output;
    },

    addElementClass: function(strClass) {
        this._classNames.push(strClass);
    },

    setCbwAnsweringNumber: function(strPhonenr) {
        this._cbwConfiguration.answering_number = strPhonenr;
    },

    setCbwCallerId: function(strPhonenr) {
        this._cbwConfiguration.caller_id = strPhonenr;
    },

    setAdv: function (strAdvid) {
        this._advid[strAdvid.id] = strAdvid;
        this._allAdvid[strAdvid.id] = strAdvid;
        this._stradvid = strAdvid.id;
    },

    setShard: function (shard) {
        this._shard = shard;
    },

    setCookieDomain: function (cookieDomain) {
        this._cookieDomain = cookieDomain;
    },

    addAlternativeAnsweringNumbers: function (altNums) {
        this._altAnsNums = altNums;
    },

    prepareData: function (b) {
        if (b && !this.checkSameSite()) {
            this.setCookie('__fs_dncs_prep_u', document.location.href, 43200);
            this.setCookie('__fs_dncs_prep_r', document.referrer ? document.referrer : '', 43200);
        }
    },

    readConfigurationBundle: function () {
        if (typeof(__fs_conf) == 'object' && !__fs_conf._proxyId) {
            var tmp_fs_conf = __fs_conf;
            __fs_conf = new __fs_configuration_proxy(this);

            for (key in tmp_fs_conf) {
                this.parseConfiguration(tmp_fs_conf[key][0], tmp_fs_conf[key][1]);
            }
        }
    },

    parseConfiguration: function (strParameter, strValue) {
        if (this._configurationFrozen) {

        } else if (typeof(this[strParameter]) == 'function') {
            this[strParameter](strValue);
        } else {
            this.setParameter(strParameter, strValue);
        }
    },

    setParameter: function (strParameter, strValue) {
        this._parameters[strParameter] = strValue;
    },

    getParameter: function (strParameter, strDefaultValue) {
        if (this._parameters.hasOwnProperty(strParameter)) {
            return this._parameters[strParameter];
        } else if (typeof(strDefaultValue) != 'undefined') {
            return strDefaultValue;
        } else {
            return null;
        }
    },

    replaceNumber: function (element, replaceWith) {
        var oldNumber = this.cleanNumber(element.innerHTML);
        var formattedNumber = this._formattingFunction(replaceWith.local, replaceWith.e164);
        if (formattedNumber === null) {
            return;
        }
        var newNumber = unescape(formattedNumber);
        var cleanNumber = this.cleanNumber(replaceWith.e164);

        if (element.tagName == "FORM") {
            oldNumber = this.cleanNumber(element.action);
            element.action = (element.action.indexOf("tel:") != -1) ? "tel:" + cleanNumber : newNumber;
        } else if (element.tagName == "A" && this.cleanNumber(element.href) == this.cleanNumber(element.innerHTML)) {
            element.innerHTML = (element.innerHTML.indexOf("tel:") != -1) ? "tel:" + cleanNumber : newNumber;
            element.href = (element.href.indexOf("tel:") != -1) ? "tel:" + cleanNumber : newNumber;
        } else if (element.tagName == "A") {
            element.href = (element.href.indexOf("tel:") != -1) ? "tel:" + cleanNumber : newNumber;
        } else if (element.tagName != "A") {
            element.innerHTML = newNumber;
        }
        this.notifyNumberReplacedListeners(element, oldNumber, newNumber);
    },

    notifyNumberReplacedListeners: function (element, number, replacedWith) {
        for (var key in this._numberReplacedListeners) {
            var thisObj = this;
            setTimeout(function() {
                thisObj._numberReplacedListeners[key](element, number, replacedWith);
            }, 1);
        }
    },

    addNumberReplacedListener: function (f) {
        if (typeof f === 'function') {
            this._numberReplacedListeners.push(f);
        }
    },

    removeNumberReplacedListener: function(f) {
        for (var i = 0; i < this._numberReplacedListeners.length; i += 1) { 
            if (this._numberReplacedListeners[i] == f) {
                this._numberReplacedListeners.splice(i, 1);
                i -= 1;
            }
        }
    },

    removeAllNumberReplacedListeners: function () {
        this._numberReplacedListeners = [];
    },

    addNumberConfiguration: function (configuration) {
        if (typeof configuration[0] === 'string' && typeof configuration[1] === 'object') {
            this._numberConfigurations[this.cleanNumber(configuration[0])] = configuration[1];
        }
    },

    setParameterString: function (s) {
        this._parameterString = s;
    },

    appendCookies: function (s) {
        for (var i = 0; i < s.length; i++) {
            if (!this._defaultCookies[s[i]]) {
                this._defaultCookies.push(s[i]);
            }
        }
    },

    clearFormattingFunction: function () {
        this._formattingFunction = function(s) { return s; };
    },

    setFormattingFunction: function (f) {
        if (typeof(f) == 'function') {
            this._formattingFunction = f;
        }
    },

    waitFor: function (c, o, d, t) {
        var tP;
        var iP=setInterval(function () {
            if (typeof(__fs_dncs_instance) === 'undefined') return;
            if (!c()) return;

            clearInterval(iP);
            if (tP) clearTimeout(tP);
            o();
        },d);

        if (t) tP=setTimeout(function () {
            clearInterval(iP);
        },t);
    },

    setWaitForFunction: function(f, d, t) {
        if (typeof(f) == 'function') {
            if (!d) {
                d = 100;
            }
            if (!t) {
                t = false;
            }
            this._waitFor = true;
            this.waitFor(f, function() { __fs_dncs_instance.loadEvent(); }, d, t);
        }
    },

    setLoadModel: function(s) {
        if (s == 'onDomLoaded') {
            this._loadModel = 'ondom';
        }
    },

    addLoadEvent: function (func) {
        if (this._loadModel == 'onload') {
            if (window.addEventListener) {
                // W3C DOM
                window.addEventListener('load', func, false);
            } else if (window.attachEvent) {
                // IE DOM
                window.attachEvent('onload', func);
            }
        } else if (this._loadModel == 'ondom') {
            if (document.addEventListener) {
                // W3C DOM
                document.addEventListener('DOMContentLoaded', func, false);
            } else if (document.attachEvent) {
                // IE DOM
                document.attachEvent("onreadystatechange", function() {
                    if (document.readyState === "complete") {
                        func();
                    }
                });
            }
        }
    },

    setCookie: function (c_name, value, exminutes) {
        var exdate= new Date((new Date()).getTime()+exminutes*60000).toUTCString();
        var domain = "";
        if (this._cookieDomain) {
            domain = ";domain="+this._cookieDomain;
        }
        var c_value=escape(value) + ((exminutes==null) ? "" : "; expires="+exdate+domain+"; path=/");
        document.cookie=c_name + "=" + c_value;
    },

    getCookie: function (c_name) {
        var i,x,y,ARRcookies=document.cookie.split(";");
        for (i=0;i<ARRcookies.length;i++) {
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x==c_name) {
                return unescape(y);
            }
        }

        return '';
    },

    iterate_the_DOM: function (func) {
        var elems = document.getElementsByTagName("*"), i = elems.length;
        do {
            func(elems[i]);
        } while(--i);
    },

    getElementsByClassName: function (className) {

        // IE detection from http://tanalin.com/en/articles/ie-version-js/
        var ieEightOrLower = (document.all && !document.addEventListener);

        if (document.getElementsByClassName && !ieEightOrLower) {
            return document.getElementsByClassName(className);
        }

        var results = [];
        this.iterate_the_DOM(function(elem) {
            if (elem && elem.className.indexOf(className) != -1) {
                results.push(elem);
            }
        });
        return results;
    },

    cleanNumber: function (string) {
        string = string.trim();
        string = String(unescape(string)).replace(/(<([^>]+)>)/ig,"").replace(/\(0\)/gi, "").replace(/tel:/, "").replace(/telprompt:/, "");
        var prefix = string.replace(/(^\+?).*/,"$1");
        return prefix + string.replace(/[^0-9]/gi, "");
    },
    
    cleanNumbersSeparated: function (string, separator) {
        var separated = string.split(separator);
        var size = separated.length;
        var clean = [];
        for(var i=0; i<size; i++) {
            clean[i] = this.cleanNumber(separated[i]);
        }
        var unseparated = clean.join(separator);
        return unseparated;
    },

    replaceNumberInText: function(node, start, end) {
        var number = this._numbers[this.cleanNumber(node.nodeValue.substring(start,end))];
        if (number && number.replace_with) {
            var replaceWith = number.replace_with;
            var formattedNumber = this._formattingFunction(replaceWith.local, replaceWith.e164);
            if (formattedNumber === null) {
                return;
            }
            var oldNumber = this.cleanNumber(node.nodeValue.substring(start,end));

            var newNumber = unescape(formattedNumber);
            node.nodeValue = node.nodeValue.substring(0,start) + newNumber + node.nodeValue.substring(end);

            // If parentNode exists of the text node, take that, otherwise take the text node itself as in the case of href attributes for example
            this.notifyNumberReplacedListeners(node.parentNode?node.parentNode:node, oldNumber, newNumber);
        }
    },

    addNumberInText: function(node, start, end) {
        var myNum = this.cleanNumber(node.nodeValue.substring(start,end));
        // Assume cleaned numbers are at least 5 digits long
        if (myNum.length >= 5) {
            this._numbers[myNum] = {};
        }
    },

    addOrReplaceNumbersInText: function(node,replaceFlag) {
        var inNumber = false;
        var numberStartAt = 0;
        var numberEndAt = 0;
        if (node.nodeValue && node.nodeValue.length < 50000 && /\d.*\d.*\d.*\d.*\d/.test(node.nodeValue)) {
            // At least five digits
            var nodeValue = node.nodeValue.split('');
            for (var i=0; i < node.nodeValue.length; i++) {
                var c = nodeValue[i];
                if (inNumber) {
                    if (c >= '0' && c <= '9') {
                        numberEndAt = i + 1;
                    } else if (c == '-' || c == ' ' || c == '\t' || c == '\r' || c == '\n' || c == '.' || c == '(' || c == ')' || c == '\x0b' || c == '/') {
                        if (c == '(' || c == '/') {
                            if (replaceFlag == false) {
                                // Just search for numbers
                                this.addNumberInText(node, numberStartAt, numberEndAt);
                            } else {
                                this.replaceNumberInText(node, numberStartAt, numberEndAt);
                            }
                        } else {
                            // ok, maybe in a number still, just continue
                        }
                    } else {
                        if (replaceFlag == false) {
                            // Just search for numbers
                            this.addNumberInText(node, numberStartAt, numberEndAt);
                        } else {
                            // Replace number
                            this.replaceNumberInText(node, numberStartAt, numberEndAt);
                        }
                        numberStartAt = 0;
                        numberEndAt = 0;
                        inNumber = false;
                    }
                } 

                if (!inNumber && (c == '+' || (c >= '0' && c <= '9'))) {
                    // Start of number
                    inNumber = true;
                    numberStartAt = i;
                }
            }
            if (inNumber) {
                if (replaceFlag == false) {
                    // Just search for numbers
                    this.addNumberInText(node, numberStartAt, numberEndAt);
                } else {
                    // Replace numbers..
                    this.replaceNumberInText(node, numberStartAt, numberEndAt);
                }
                numberStartAt = 0;
                numberEndAt = 0;
                inNumber = false;
            }
        }
    },

    loopTextElementsForNumbers: function(node, replaceFlag) {
        if (node) {
            node = node.firstChild;
            while (node != null) {
                var tagName = node.tagName;
                if (tagName) {
                    tagName = tagName.toLowerCase();
                }
                if (node.nodeType == 3) {
                    // Text node
                    this.addOrReplaceNumbersInText(node, replaceFlag);
                } else if (node.nodeType == 1 && (!tagName || (tagName && tagName != "script" && tagName != "style" && tagName != "noscript"))) {
                    this.loopTextElementsForNumbers(node, replaceFlag);
                    if (tagName && tagName == "a") {
                        var attr = node.getAttributeNode("href");
                        if (attr) {
                            this.addOrReplaceNumbersInText(attr, replaceFlag);
                        }
                    }
                    if (tagName && tagName == "form") {
                        var attr = node.getAttributeNode("action");
                        if (attr) {
                            this.addOrReplaceNumbersInText(attr, replaceFlag);
                        }
                    }
                }
                node = node.nextSibling;
            }
        }
    },

    loadEvent: function () {
        var name, elems, i, len;

        if (this._loadEventTriggered) {
            return;
        }

        this._loadEventTriggered = true;

        // Numbers to replace?
        for (name in this._classNames) {
            elems = this.getElementsByClassName(this._classNames[name]);
            for (i = 0, len = elems.length; i < len; i += 1) {
                if ( elems[i].tagName == "A" && this.cleanNumber(elems[i].innerHTML) == this.cleanNumber(elems[i].href) ) {
                    this._spans.push(elems[i]);
                    this._numbers[this.cleanNumber(elems[i].innerHTML)] = {};
                } else if ( elems[i].tagName == "A" ) {
                    this._spans.push(elems[i]);
                    this._numbers[this.cleanNumber(elems[i].href)] = {};
                } else if ( elems[i].tagName == "FORM" ) {
                    this._spans.push(elems[i]);
                    this._numbers[this.cleanNumber(elems[i].action)] = {};
                } else {
                    if (elems[i].children.length == 0 && elems[i].tagName != "A") {
                        this._spans.push(elems[i]);
                        this._numbers[this.cleanNumber(elems[i].innerHTML)] = {};
                    } else if ( elems[i].children.length > 0 && elems[i].firstChild.tagName == "A" && this.cleanNumber(elems[i].firstChild.innerHTML) == this.cleanNumber(elems[i].firstChild.href) ) {
                        this._spans.push(elems[i].firstChild);
                        this._numbers[this.cleanNumber(elems[i].firstChild.innerHTML)] = {};
                    } else if ( elems[i].children.length > 0 && elems[i].firstChild.tagName == "A" ) {
                        this._spans.push(elems[i].firstChild);
                        this._numbers[this.cleanNumber(elems[i].firstChild.href)] = {};
                    }
                }
            }
        }

        if (this.getParameter("numberDetection", false)) {
            this.loopTextElementsForNumbers(document.body, false);
        }

        for (var key in this._advid) {
            if (this._advid[key].cbw_visible_number) {
                this._advid[key].cbw_visible_number = this.cleanNumber(this._advid[key].cbw_visible_number);
                this._numbers[this._advid[key].cbw_visible_number] = {};
            }
        }

        this.makeBackendRequest();
    },

    trackPage: function(opts) {
        opts = opts || {};

        if (this._spa.urlHistory.length > 0) {
            this._spa.referrer = this._spa.urlHistory[this._spa.urlHistory.length - 1];
        }

        this._spa.urlHistory.push(window.location.href);

        if (opts.noRequest) {
            return;
        }

        this._loadEventTriggered = false;
        this.loadEvent();
    },

    checkSameSite: function() {
        if (this._spa.referrer) {
            return 1;
        }

        var refDomain='', sameSite=0;
        if (document.referrer) {
            var a = document.createElement('a');
            a.href = document.referrer;
            refDomain = a.hostname;
        }

        if (refDomain == window.location.hostname) {
            sameSite = 1;
        }

        return sameSite;
    },

    makeBackendRequest: function (overrideNumberToReplace, overrideAdvid, overrideParameters, overrideCallback, overrideShard, overrideSendNotSameSite) {
        var sessionId, url, referrer, numbersToReplace, advid, key, parameters, trackingId, extTrack, coData = '', altNumData, eventTag;

        for (var i = 0; i < this._p_s_parameters.length; i++) {
            if (typeof window[this._p_s_parameters[i]] === 'string') {
                coData = coData + '&_p_s' + this._p_s_parameters[i] + '=' + window[this._p_s_parameters[i]];
            }
            if (typeof window[this._p_s_parameters[i]] === 'object') {
                coData = coData + '&_p_s' + this._p_s_parameters[i] + '=' + window[this._p_s_parameters[i]].join('.');
            }
        }

        if (typeof(ga) != 'undefined' && typeof(ga.getAll) === 'function') {
            var ga_trackers = ga.getAll();
            if (typeof(ga_trackers[0]) === 'object') {
                coData = coData + '&_p_ga_wpi=' + ga_trackers[0].b.data.get('trackingId');
            }
        } else if (typeof(_gat) != 'undefined' && typeof(_gat.bb) === 'string') {
            coData = coData + '&_p_ga_wpi=' + _gat.bb;
        }
        
        
        if (typeof(SZCD) != 'undefined' && typeof(SZCD.UID) != 'undefined' && typeof(SZCD.CID) != 'undefined' && SZCD.CID !== '') {
            coData = coData + '&_p_sm__uid=' + SZCD.UID;
            coData = coData + '&_p_sm__cid=' + SZCD.CID;
        }

        if (typeof Adform !== 'undefined' && typeof Adform._uid !== 'undefined' && Adform._uid !== '') {
            coData = coData + '&_p_adform_cookie_id=' + Adform._uid;
        }

        for (var i = 0; i < this._defaultCookies.length; i++) {
            if (this.getCookie(this._defaultCookies[i])) {
                coData = coData + '&' + this._defaultCookies[i] + '=' + encodeURIComponent(this.getCookie(this._defaultCookies[i]));
            }
        }

        if (typeof(s) == 'object' && s != null && typeof(s.c_r) == 'function') {
            coData = coData + '&_p_asc_s_vi' + '=' + s.c_r('s_vi').substring(7,40);
            if (typeof(s.un) == 'string') {
                coData = coData + '&_p_asc_un' + '=' + s.un;
            }
            if (typeof(s.version) == 'string') {
                coData = coData + '&_p_asc_version' + '=' + s.version;
            }
            if (typeof(s.visitorNamespace) == 'string') {
                coData = coData + '&_p_asc_visitorNamespace' + '=' + s.visitorNamespace;
            }
            if (typeof(s.trackingServer) == 'string') {
                coData = coData + '&_p_asc_trackingServer' + '=' + s.trackingServer;
            }
        }

        if (typeof(return_ia_js_uid) != 'undefined' && typeof(return_ia_js_uid) === 'function') {
            coData = coData + '&_p_ia_uid' + '=' + return_ia_js_uid();
        }

        if (typeof(heap) != 'undefined' && typeof(heap.appid) != 'undefined' && typeof(heap.userid) != 'undefined') {
            coData = coData + '&_p_heap_aid' + '=' + heap.appid;
            coData = coData + '&_p_heap_uid' + '=' + heap.userid;
        }

        if (typeof(_vwo_acc_id) != 'undefined') {
            var _vis_data='',_vis_combination,_vis_id,_vis_l=0;
            for (;_vis_l<_vwo_exp_ids.length;_vis_l++) {
                _vis_id = _vwo_exp_ids[_vis_l];
                if (_vwo_exp[_vis_id].ready) {
                    _vis_combination = this.getCookie('_vis_opt_exp_'+_vis_id+'_combi');
                    if (typeof(_vwo_exp[_vis_id].combination_chosen) != "undefined") {
                        _vis_combination = _vwo_exp[_vis_id].combination_chosen;
                    }
                    if (typeof(_vwo_exp[_vis_id].comb_n[_vis_combination]) != "undefined") {
                        _vis_data = _vis_data + _vis_id + ',' + _vis_combination + ';';
                    }
                }
            }
            if (_vis_data) {
                coData = coData + '&_p_vwo_acc_id' + '=' + _vwo_acc_id;
                coData = coData + '&_p_vwo_t_v' + '=' + _vis_data;
                coData = coData + '&_p_vwo_uuid' + '=' + this.getCookie('_vwo_uuid');
            }
        }

        if (typeof(optimizely) != 'undefined') {
            coData = coData + '&_p_opt_proj_id' + '=' + optimizely.getProjectId();
            coData = coData + '&_p_opt_user_id' + '=' + this.getCookie('optimizelyEndUserId');
            coData = coData + '&_p_opt_bucks' + '=' + decodeURIComponent(this.getCookie('optimizelyBuckets'));
            coData = coData + '&_p_opt_segs' + '=' + decodeURIComponent(this.getCookie('optimizelySegments'));
        }

        sameSite = this.checkSameSite();

        if ((sameSite == 1 || overrideSendNotSameSite) && this.getCookie('__fs_dncs_prep_u')) {
            url = this.base64_encode(decodeURI(this.getCookie('__fs_dncs_prep_u')));
            referrer = this.getCookie('__fs_dncs_prep_r') ? this.base64_encode(decodeURI(this.getCookie('__fs_dncs_prep_r'))) : '';
        } else {
            url = this.base64_encode(decodeURI(document.location.href));

            if (this._spa.referrer) {
                referrer = this.base64_encode(decodeURI(this._spa.referrer));
            } else {
                referrer = document.referrer ? this.base64_encode(decodeURI(document.referrer)) : '';
            }
        }

        numbersToReplace = [];
        advid = [];
        if (!overrideAdvid) {
            for (var key in this._advid) {
                var requestedNdc = '';
                if (this._advid[key].requested_ndc) {
                    requestedNdc = this._advid[key].requested_ndc;
                }

                advid.push(key+';'+requestedNdc);
            }
        } else {
            advid = [ overrideAdvid ];
        }

        if (!overrideShard) {
            overrideShard = this._shard;
        }

        if (this._altAnsNums != '') {
            altNumData = this.base64_encode(JSON.stringify(this._altAnsNums));
        }

        advid = this.base64_encode(advid.join(','));

        if (!overrideNumberToReplace) {
            for (key in this._numbers) {
                if (!this._numbers.hasOwnProperty(key)) {
                    continue;
                }
                if (key.length > 20) {
                    // skip too long numbers
                    continue;
                }
                if (this._numberConfigurations[key] && this._numberConfigurations[key].connect_to) {
                    if (this._numberConfigurations[key].connect_to.indexOf(";") === -1) {
                        var cleanConnectToNumber = this.cleanNumber(this._numberConfigurations[key].connect_to);
                    } else {
                        var cleanConnectToNumber = this.cleanNumbersSeparated(this._numberConfigurations[key].connect_to,";");
                    }
                    numbersToReplace.push(cleanConnectToNumber);
                    this._alternativeNumbers[cleanConnectToNumber] = this._alternativeNumbers[cleanConnectToNumber] || [];
                    this._alternativeNumbers[cleanConnectToNumber].push(key);
                } else {
                    numbersToReplace.push(key);
                }
            }
        } else {
            if (this._numberConfigurations[overrideNumberToReplace] && this._numberConfigurations[overrideNumberToReplace].connect_to) {
                var cleanConnectToNumber = this.cleanNumber(this._numberConfigurations[overrideNumberToReplace].connect_to);
                numbersToReplace.push(cleanConnectToNumber);
                this._alternativeNumbers[cleanConnectToNumber] = this._alternativeNumbers[cleanConnectToNumber] || [];
                this._alternativeNumbers[cleanConnectToNumber].push(overrideNumberToReplace);
            } else {
                numbersToReplace.push(overrideNumberToReplace);
            }
        }

        numbersToReplace = this.base64_encode(numbersToReplace.join(','));

        parameters = this.base64_encode((overrideParameters ? overrideParameters : this._parameterString) + coData);

        var callback = '__fs_dncs_instance.backendCallback';
        if (overrideCallback) {
            callback = overrideCallback;
        }

        if (this.getCookie('__fs_dncs_sessionid_' + this._stradvid)) {
            sessionId = this.getCookie('__fs_dncs_sessionid_' + this._stradvid);
        } else if (this.getCookie('__fs_dncs_sessionid')) {
            sessionId = this.getCookie('__fs_dncs_sessionid');
        } else {
            sessionId = '';
        }
        if (this.getCookie('__fs_dncs_trackingid_' + this._stradvid)) {
            trackingId = this.getCookie('__fs_dncs_trackingid_' + this._stradvid);
        } else if (this.getCookie('__fs_dncs_sessionid')) {
            trackingId = this.getCookie('__fs_dncs_trackingid');
        } else {
            trackingId = '';
        }

        extTrack = this.getCookie('__fs_dncs_exttrack') ? this.getCookie('__fs_dncs_exttrack') : '0';

        eventTag = this._getNumberEventTag ? this.base64_encode(this._getNumberEventTag) : '';

        var callbackParameters =  'advid:' + advid + '/sessionId:'+sessionId+'/url:'+url+'/referrer:'+referrer+'/numbersToReplace:'+numbersToReplace+'/parameters:'+parameters+'/sameSite:'+(overrideSendNotSameSite ? 0 : sameSite)+'/trackingId:'+trackingId+'/extTrack:'+extTrack+(overrideShard?('/shard:'+overrideShard):'')+(altNumData?('/altNum:'+altNumData):"")+(eventTag?('/eventTag:'+eventTag):'');
        var endpointUrl = this.getParameter('freespeeHost', '//analytics.freespee.com')+'/index.php?url=/external/dncs';
        this.jsonp(endpointUrl, callback, callbackParameters);
    },
    
    checkAndUpdatePendingBackendRequest: function(backendRequestId,callback) {
        var curTimestamp = new Date().getTime();
        for(var callbackInfoKey in this.numberCallbackInfo) {
            if (!this.numberCallbackInfo.hasOwnProperty(callbackInfoKey)) {
                continue;
            }
            var callbackInfo = this.numberCallbackInfo[callbackInfoKey];
            if(!callbackInfo)
                continue;
            // If recent pending request, add callback to pending request
            if(callbackInfo['backendRequestId'] == backendRequestId && curTimestamp < callbackInfo['timestamp'] + 600) {
                callbackInfo['callbacks'].push(callback);
                callbackInfo['timestamp'] = curTimestamp;
                return true;
            }
        }
        return false;
    },

    numberCallbackInfo: {},
    getNumber: function(callback, reference, phonenr, advid, shard, parameterString, eventTag) {
        var curTimestamp = new Date().getTime();
        if (eventTag) {
            this._getNumberEventTag = eventTag;
        } else {
            this._getNumberEventTag = 'getNumber';
        }
        var temp = '__fs_' + Math.floor((Math.random()*10000000));
        window[temp] = function(temp) {
            return function(data) { __fs_dncs_instance.backendCallback(data, temp); };
        }(temp);
        
        var backendRequestId = phonenr + advid + parameterString + shard + this._getNumberEventTag;
        
        if (this.checkAndUpdatePendingBackendRequest(backendRequestId, callback)) {
            return;
        }
        
        this.makeBackendRequest(phonenr, advid, parameterString, temp, shard, 0);
        this.numberCallbackInfo[temp] = { 'callbacks': [ callback ], 'reference': reference, 'backendRequestId': backendRequestId, 'timestamp': curTimestamp };
    },

    requestCallback: function(advid, answeringnr, cc, phonenr, e164callerid, customdata, time, callback, callbackref, retries) {
        var curTimestamp = new Date().getTime();
        var sessionId;
        var temp = '__fs_' + Math.floor((Math.random()*10000000));
        window[temp] = function(temp) {
            return function(data) { __fs_dncs_instance.cbwFormInternalCallback(data, temp); };
        }(temp);

        advid = advid || this._stradvid;

        if (this.getCookie('__fs_dncs_sessionid_' + advid)) {
            sessionId = this.getCookie('__fs_dncs_sessionid_' + advid);
        } else if (this.getCookie('__fs_dncs_sessionid')) {
            sessionId = this.getCookie('__fs_dncs_sessionid');            
        } else {
            callback(callbackref, { 'status': 'fail', 'errors': ['No session initiated.'] });
            return;
        }

        var backendRequestId = sessionId+phonenr+cc+answeringnr+(time?('&time='+time):'')+e164callerid+this.base64_encode(JSON.stringify(customdata))+retries;        
        if (this.checkAndUpdatePendingBackendRequest(backendRequestId, callback)) {
            return;
        }
        
        var requestUrl = this.getParameter('freespeeHost', '//analytics.freespee.com')+
                '/cbw/call?jsonp='+temp+'&session_id='+sessionId+'&phonenr='+encodeURIComponent(this.cleanNumber(phonenr))+
                '&cc_phonenr='+encodeURIComponent(cc)+'&answeringnr='+encodeURIComponent(answeringnr)+
                (time?('&time='+time):'')+
                '&caller_id='+encodeURIComponent(this.cleanNumber(e164callerid))+'&custom='+this.base64_encode(JSON.stringify(customdata))+
                '&retries='+encodeURIComponent(retries);
        
        this.jsonp(requestUrl, null);
        this.numberCallbackInfo[temp] = { 'callbacks': [ callback ], 'reference': callbackref, 'backendRequestId': backendRequestId, 'timestamp': curTimestamp };
    },

    cbwFormInternalCallback: function(data, overrideCallbackId) {
        if (overrideCallbackId && this.numberCallbackInfo[overrideCallbackId]) {
            var callbacks = this.numberCallbackInfo[overrideCallbackId]['callbacks'];
            for(var i = 0; i < callbacks.length; i++) {
                callbacks[i](this.numberCallbackInfo[overrideCallbackId]['reference'], data);
            }
            this.numberCallbackInfo[overrideCallbackId] = null;
        }
    },

    loadAdv: function(advid) {
        this._loadEventTriggered = false;
        this._advid = {};
        this.setAdv(advid);
        this.loadEvent();
    },

    backendCallback: function (data,overrideCallbackId) {

        var advidlen = 0;
        for (var key in this._advid) {
            if (this._advid.hasOwnProperty(key)) {
                advidlen++;
            }
        }

        if (data.status == 'success' && data.clear_cookie == false) {
            if (advidlen <= 1) {
                this.setCookie('__fs_dncs_sessionid_' + data.advid, data.session_id, 43200);
            } else {
                // If setAdv is called multiple times, one session must prevail
                this.setCookie('__fs_dncs_sessionid', data.session_id, 43200);
            }
        } else if (data.status == 'success' && data.clear_cookie == true) {
            if (advidlen <= 1) {
                this.setCookie('__fs_dncs_sessionid_' + data.advid, '', -1);
            } else {
                this.setCookie('__fs_dncs_sessionid', '', -1);
            }
        }

        if (data.status == 'success') {
            if (advidlen <= 1) {
                this.setCookie('__fs_dncs_trackingid_' + data.advid, data.tracking_id, 525600);
            } else {
                this.setCookie('__fs_dncs_trackingid', data.tracking_id, 525600);
            }
            this.setCookie('__fs_dncs_exttrack', data.ext_track, 525600);

            if (overrideCallbackId && this.numberCallbackInfo[overrideCallbackId]) {
                for (var y = 0, ylen = data.numbers.length; y < ylen; y++) {
                    var callbacks = this.numberCallbackInfo[overrideCallbackId]['callbacks'];
                    for(var i = 0; i < callbacks.length; i++) {
                        callbacks[i](this.numberCallbackInfo[overrideCallbackId]['reference'], data.numbers[y].replace_with);
                    }
                }
                this.numberCallbackInfo[overrideCallbackId] = null;
                return;
            }

            if (typeof(this._allAdvid[data.advid].formatting_function) == 'function') {
                this._formattingFunction = this._allAdvid[data.advid].formatting_function;
            }

            for (var y = 0, ylen = data.numbers.length; y < ylen; y++) {
                if (this._alternativeNumbers.hasOwnProperty(data.numbers[y].number_on_page)) {
                    for (var j = 0; j < this._alternativeNumbers[data.numbers[y].number_on_page].length; j++) {
                        this._numbers[this._alternativeNumbers[data.numbers[y].number_on_page][j]].replace_with = data.numbers[y].replace_with;
                    }
                } else {
                    this._numbers[data.numbers[y].number_on_page].replace_with = data.numbers[y].replace_with;
                }
            }

            for (var i = 0, ilen = this._spans.length; i < ilen; i++) {
                //Strip down number string from the DOM
                var spanNumber = this.cleanNumber(this._spans[i].innerHTML);
                if (spanNumber == '' && this._spans[i].action) {
                    spanNumber = this.cleanNumber(this._spans[i].action);
                }
                if (spanNumber == '') {
                    spanNumber = this.cleanNumber(this._spans[i].href);
                }
                if (this._numbers[spanNumber] && this._numbers[spanNumber].replace_with) {
                    this.replaceNumber(this._spans[i], this._numbers[spanNumber].replace_with);
                }
            }

            if (this.getParameter("numberDetection", false)) {
                var that = this;

                // Push action last in execution queue in order to avoid rendering errors in IE
                setTimeout(function() {
                    that.loopTextElementsForNumbers(document.body,true);
                }, 1);
            }

            // Android browser redraw fix
            if (this._spans.length > 0 && !this.getParameter('preventWebkitWorkaround', false)) {
                this._spans[0].style.cssText += ';-webkit-transform:rotateZ(0deg)';
                this._spans[0].offsetHeight;
                this._spans[0].style.cssText += ';-webkit-transform:none';
            }

            for (var key in this._advid) {
                // CBW does not use allAdvid yet.. Thus, loadAdv() is not allowed for CBW customers
                if (this._advid[key].cbw_visible_number && this._numbers[this._advid[key].cbw_visible_number] && this._numbers[this._advid[key].cbw_visible_number].replace_with) {
                    this._advid[key].cbw_visible_number = this._numbers[this._advid[key].cbw_visible_number].replace_with.local;
                } else {
                    delete this._advid[key].cbw_visible_number;
                }
            }

            if (data.cbw_enabled && this._allAdvid[data.advid].cbw_answering_number_id) {
                    this.setupCbw(data.session_id, this._advid[data.advid]);
            }
        }
    },

    jsonp: function (url, strCallback, query) {

        if (strCallback && query) {
            url += "/callback:";
            url += strCallback + "/";

            if (query) {
                url += query + "/";
            }
        }

        var script = document.createElement("script");
        script.setAttribute("src",url);
        script.setAttribute("type","text/javascript");

        var head = document.getElementsByTagName('head');
        if (head.length > 0) {
            head[0].appendChild(script);
        }
    },

    openCbw: function () {
        var overlay, overlaybg, top;

        overlay = document.getElementById('fs-callback-widget-overlay');

        if (this.getParameter('cbw_style', 'desktop') === 'desktop') {
            overlaybg = document.getElementById('fs-callback-widget-bg');

            if (overlay && overlaybg) {
                overlay.style.display = 'block';
                overlaybg.style.display = 'block';
            }

        } else {
            top = document.getElementById('fs-callback-widget-top');

            if (overlay && top) {
                this.oldPageMargin = document.body.style.margin;
                this.oldPagePadding = document.body.style.padding;
                document.body.style.margin = "0px";
                document.body.style.padding = "0px";

                overlay.style.display = 'block';
                top.style.display = 'block';
                window.scrollTo(0,0);
            }
        }
    },

    closeCbw: function () {
        var overlay, overlaybg, top;

        overlay = document.getElementById('fs-callback-widget-overlay');

        if (this.getParameter('cbw_style', 'desktop') === 'desktop') {
            overlaybg = document.getElementById('fs-callback-widget-bg');

            if (overlay && overlaybg) {
                overlay.style.display = 'none';
                overlaybg.style.display = 'none';
            }
        } else {
            top = document.getElementById('fs-callback-widget-top');

            if (overlay && top) {
                document.body.style.margin = this.oldPageMargin;
                document.body.style.padding = this.oldPagePadding;
                overlay.style.display = 'none';
                top.style.display = 'none';
            }
        }
    },

    setupCbw: function (session_id, advSettings) {
        var iFrameSrc, iframe, d, style, html, open, close, overlay, overlaybg, top, back, bgImg;

        iFrameSrc = this.getParameter('freespeeHost', '//analytics.freespee.com')+'/cbw/frame';
        iFrameSrc += '/sid:' + session_id;
        iFrameSrc += '/answeringnr:' + encodeURIComponent(encodeURIComponent(advSettings.cbw_answering_number_id));

        if (advSettings.cbw_caller_id) {
            iFrameSrc += '/caller_id:' + encodeURIComponent(encodeURIComponent(advSettings.cbw_caller_id));
        }

        if (advSettings.cbw_visible_number) {
            iFrameSrc += '/visible_number:' + encodeURIComponent(encodeURIComponent(advSettings.cbw_visible_number));
        }

        d = new Date();

        iFrameSrc += '/tz_offset:' + d.getTimezoneOffset();
        iFrameSrc += '/language:' + this.getParameter('language', 'en_US');

        if (advSettings.cbw_style === 'mobile') {
            iFrameSrc += '/mobile:' + 1;
        }

        style = advSettings.cbw_style || 'desktop';

        if (style === 'desktop') {
            open = document.getElementById(advSettings.cbw_button_id || 'fs-open-callback-widget');

            if (!open) {
                open = document.createElement('div');
                open.setAttribute('id', 'fs-open-callback-widget');
                open.style.cursor = 'pointer';
                open.style.position = 'absolute';
                open.style.right = '0';
                open.style.top = '200px';
                open.style.width = '39px';
                open.style.height = '58px';
                open.style.background = 'url('+this.getParameter('freespeeHost', '//analytics.freespee.com')+'/images/tab-phone-green.png) no-repeat';
                document.body.appendChild(open);
            }

            overlaybg = document.createElement('div');
            overlaybg.setAttribute('id', 'fs-callback-widget-bg');
            overlaybg.style.display = 'none';
            overlaybg.style.position = 'fixed';
            overlaybg.style.top = '0';
            overlaybg.style.right = '0';
            overlaybg.style.bottom = '0';
            overlaybg.style.left = '0';
            overlaybg.style.background = '#000';
            overlaybg.style.opacity = '.5';
            overlaybg.style.filter = 'alpha(opacity = 50)';

            overlay = document.createElement('div');
            overlay.setAttribute('id', 'fs-callback-widget-overlay');
            overlay.style.display = 'none';
            overlay.style.position = 'fixed';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.margin = '-137px 0 0 -195px';
            overlay.style.backgroundColor = '#fff';
            overlay.style.padding = '2px';
            overlay.style.borderRadius = '4px';
            overlay.style.boxShadow = 'rgb(0, 0, 0) 0px 3px 6px';
            overlay.style.zIndex = 9999;

            iframe = document.createElement('iframe');
            iframe.setAttribute('src', iFrameSrc);
            iframe.setAttribute('width', '415');
            iframe.setAttribute('height', '270');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');

            overlay.appendChild(iframe);

            close = document.createElement('div');
            close.setAttribute('id', 'fs-close-callback-widget');
            close.style.cursor = 'pointer';
            close.style.position = 'absolute';
            close.style.top = '-16px';
            close.style.right = '-16px';
            close.style.width = '32px';
            close.style.height = '31px';
            close.style.background = 'url('+this.getParameter('freespeeHost', '//analytics.freespee.com')+'/images/close_cbw.png) no-repeat';

            overlay.appendChild(close);

            document.body.appendChild(overlaybg);
            document.body.appendChild(overlay);

            open.onclick = function (evt) {
                overlay.style.display = 'block';
                overlaybg.style.display = 'block';
            };

            overlaybg.onclick = close.onclick = function (evt) {
                overlay.style.display = 'none';
                overlaybg.style.display = 'none';
            };
        } else {

            overlay = document.createElement('div');
            overlay.setAttribute('id', 'fs-callback-widget-overlay');
            overlay.setAttribute('style', 'line-height: 0; display: none; position: absolute; top: 0px; right: 0; left: 0; background: #fff; overflow: auto;');

            iframe = document.createElement('iframe');
            iframe.setAttribute('src', iFrameSrc);
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'auto');
            if (window.innerHeight) {
                // Try to use the current device height for the iframe
                iframe.setAttribute('style', 'min-height: ' + window.innerHeight + 'px;');
            } else {
                // Else use 360px as "default" if window.innerHeight is not supported (old browsers)
                iframe.setAttribute('style', 'min-height: 360px;');
            }
            overlay.appendChild(iframe);

            document.body.appendChild(overlay);

            open = document.getElementById(advSettings.cbw_button_id || 'fs-open-callback-widget');

            open.onclick = function (evt) {
                this.oldPageMargin = document.body.style.margin;
                this.oldPagePadding = document.body.style.padding;
                document.body.style.margin = "0px";
                document.body.style.padding = "0px";

                overlay.style.display = 'block';
                window.scrollTo(0,0);
            };

            // Use the window.postMessage() API to receive a submit from outside this iframe
            eventListener = function (event) {
                if (event.data === "cbw_back_pressed") {
                    document.body.style.margin = this.oldPageMargin;
                    document.body.style.padding = this.oldPagePadding;
                    overlay.style.display = 'none';
                }
            };

            if (window.addEventListener) {
                addEventListener("message", eventListener, false);
            } else {
                attachEvent("onmessage", eventListener);
            }

            // Register for a browser resize event in order to keep iframe size to par
            resizeEventListener = function () {
                if (window.innerHeight) {
                    // Try to use the current device height for the iframe
                    iframe.setAttribute('style', 'min-height: ' + window.innerHeight + 'px;');
                } else {
                    // Else use 360px as "default" if window.innerHeight is not supported (old browsers)
                    iframe.setAttribute('style', 'min-height: 360px;');
                }
            };

            if (window.addEventListener) {
                addEventListener("resize", resizeEventListener, false);
            } else {
                attachEvent("onresize", resizeEventListener);
            }

        }
    }
};

if (__fs_dncs_instance == undefined) {
    __fs_dncs_instance = new __fs_dncs();
}
