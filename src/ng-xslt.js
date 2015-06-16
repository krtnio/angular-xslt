(function (factory) {
    if (typeof define === 'function' && define.amd) {
        return define(['angular'], function (angular) {
            return factory(angular);
        });
    } else if (typeof exports === 'object') {
        return module.exports = factory(require('angular')).name;
    } else {
        return factory(angular);
    }
})(function (angular) {
    /**
     * Returns whether the browser supports XSLT.
     *
     * @return the browser supports XSLT
     * @type boolean
     */
    function browserSupportsXSLT (window) {
        return ('ActiveXObject' in window || // IE
                (angular.isDefined(XSLTProcessor) && angular.isDefined(XMLSerializer)));
    }

    /**
     * Searches for parsererror in given Document and returns first line of content,
     * which usually contains brief description of error cause
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
     *
     * @param {Document} document
     * @returns {String} error
     */
    function getParserError (document) {
        var err;
        if (err = document.getElementsByTagName('parsererror')[0])
            return err.textContent ? err.textContent.split('\n', 1)[0] : 'unknown parser error';

        return null;
    }

    /**
     * Transforms XML using XSLT
     *
     * @param {Window} window
     * @param {Window} document
     * @param {String} xml      Source XML that is going to be transformed
     * @param {String} xslt     XSL template that is applied for the XML transformation
     *
     * @returns {String}
     */
    function transformXml (window, document, xml, xslt) {
        if (!xml || !xslt)
            return 'No' + (!xml ? ' XML' : '') + (!xml && !xslt ? ' &' : '') + (!xslt ? ' XSLT' : '');

        if (!browserSupportsXSLT(window))
            return 'XSL transformation is not supported by your browser';

        var processor, output, xmlDoc, xsltDoc;
        if ('ActiveXObject' in window) { // IE
            xmlDoc = new ActiveXObject('Msxml2.DOMDocument');
            xmlDoc.loadXML(xml);
            if (xmlDoc.parseError.errorCode !== 0)
                return ('XML parse error (' + xmlDoc.parseError.errorCode + '): ' + xmlDoc.parseError.reason).trim();

            xsltDoc = new ActiveXObject('Msxml2.FreeThreadedDOMDocument');
            xsltDoc.loadXML(xslt);
            if (xsltDoc.parseError.errorCode !== 0)
                return ('XSLT parse error (' + xsltDoc.parseError.errorCode + '): ' + xsltDoc.parseError.reason).trim();

            var template = new ActiveXObject('Msxml2.XSLTemplate');
            try {
                template.stylesheet = xsltDoc;
            } catch (err) {
                return 'XSLT error: ' + err.message;
            }

            processor = template.createProcessor();
            processor.input = xmlDoc;
            processor.transform();

            output = processor.output;
        } else {
            var err;

            xmlDoc = (new DOMParser()).parseFromString(xml, 'text/xml');
            if (err = getParserError(xmlDoc))
                return 'XML parse error: ' + err;

            xsltDoc = (new DOMParser()).parseFromString(xslt, 'text/xml');
            if (err = getParserError(xsltDoc))
                return 'XSLT parse error: ' + err;

            processor = new XSLTProcessor();
            processor.importStylesheet(xsltDoc);

            output = (new XMLSerializer()).serializeToString(processor.transformToFragment(xmlDoc, document));
        }

        return output || '(empty)';
    }

    return angular.module('ngXslt', [])
        .filter('xslt', [
            '$window', '$document',
            function ($window, $document) {
                return transformXml.bind(this, $window, $document[0]);
            }]);
});