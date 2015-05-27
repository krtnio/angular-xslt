describe('xslt filter', function () {
    before(function () {
        this.xml = '<Test><SomeNumber>000123</SomeNumber></Test>';
        this.xslt =
            '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output method="xml" encoding="utf-8" /><xsl:template match="/"><Query><Key><SomeNumber><xsl:value-of select="//SomeNumber" /></SomeNumber></Key><Option><IncludeSomething>Y</IncludeSomething><AnotherItem>N</AnotherItem><JustForDemo>N</JustForDemo><XslStylesheet /></Option></Query></xsl:template></xsl:stylesheet>';
        this.transformedXml =
            /<Query><Key><SomeNumber>000123<\/SomeNumber><\/Key><Option><IncludeSomething>Y<\/IncludeSomething><AnotherItem>N<\/AnotherItem><JustForDemo>N<\/JustForDemo><XslStylesheet\s*\/><\/Option><\/Query>/;
    });

    beforeEach(module('ngXslt'));

    it('should have a xslt filter', inject(function ($filter) {
        expect($filter('xslt')).not.to.be.equal(null);
    }));

    describe('transformation', function () {
        describe('empty parameters handling', function () {
            it('should say that no XML and/or XSLT provided', inject(function ($filter) {
                expect($filter('xslt')()).to.be.equal('No XML & XSLT');
                expect($filter('xslt')('abs')).to.be.equal('No XSLT');
                expect($filter('xslt')('', 'a')).to.be.equal('No XML');
            }));
        });

        it('should handle invalid XML/XSLT', inject(function ($filter) {
            expect($filter('xslt')('a', 'b')).to.match(/^XML parse error( \(-?\d+\))?:/);
            expect($filter('xslt')('<a></a>', 'b')).to.match(/^XSLT parse error( \(-?\d+\))?:/);
        }));

        it('should transform XML using XSLT', inject(function ($filter) {
            var result = $filter('xslt')(this.xml, this.xslt);
            expect(result).to.be.a('string');
            expect(result).to.match(this.transformedXml);
        }));

        if (!isIE)
            it('should return a string saying there is nothing to show', inject(function ($filter) {
                expect($filter('xslt')('<test/>',
                    '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">' +
                    '<xsl:output method="xml" encoding="utf-8" />' +
                    '</xsl:stylesheet>')).to.be.equal('(empty)');
            }));
    });
});