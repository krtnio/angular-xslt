angular.module('ngXslt', [])
    .filter('xslt', [
        '$window', '$document',
        function ($window, $document) {
            /**
             * Returns whether the browser supports XSLT.
             *
             * @return the browser supports XSLT
             * @type boolean
             */
            function browserSupportsXSLT () {
                if ('ActiveXObject' in $window)
                    return true;
                else if (angular.isDefined($window.XMLHttpRequest) && angular.isDefined($window.XSLTProcessor)) { // Mozilla 0.9.4+, Opera 9+
                    if (typeof (new XSLTProcessor()).transformDocument === 'function')
                        return angular.isDefined($window.XMLSerializer);

                    return true;
                }
                return false;
            }

            return function (xml, xslt) {
                if(!xml || !xslt)
                    return ('No' + (!xml ? ' XML' : '') + (!xml && !xslt ? ' &' : '') + (!xslt ? ' XSLT' : '')).trim();

                if (!browserSupportsXSLT())
                    return 'Not supported by your browser';

                xml = (new DOMParser()).parseFromString(xml, 'text/xml');
                if(xml.getElementsByTagName('parsererror')[0])
                    return 'Invalid XML';

                if ('ActiveXObject' in $window) {
                    var trans = new ActiveXObject("Msxml2.XSLTemplate"),
                        xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
                    xslDoc.loadXML(xslt);
                    trans.stylesheet = xslDoc;
                    var proc = trans.createProcessor()
                    proc.input = xml;
                    proc.transform();
                    return proc.output;
                }

                xslt = (new DOMParser()).parseFromString(xslt, 'text/xml');

                var processor = new XSLTProcessor();

                var output;
                if (typeof processor.transformDocument === 'function') { // obsolete Mozilla interface
                    output = document.implementation.createDocument("", "", null);
                    processor.transformDocument(xml, xslt, output, null);
                    return (new XMLSerializer()).serializeToString(output);
                } else {
                    processor.importStylesheet(xslt);
                    output = processor.transformToFragment(xml, document);

                    if(!output)
                        return 'Invalid XSLT';

                    var div = document.createElement('div');
                    div.appendChild(output);
                    return div.innerHTML;
                }
            }
        }]);