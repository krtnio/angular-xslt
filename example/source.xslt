<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" encoding="utf-8" />
    <xsl:template match="/">
        <Query>
            <Key>
                <SomeNumber>
                    <xsl:value-of select="//SomeNumber" />
                </SomeNumber>
            </Key>
            <Option>
                <IncludeSomething>Y</IncludeSomething>
                <AnotherItem>N</AnotherItem>
                <JustForDemo>N</JustForDemo>
                <XslStylesheet />
            </Option>
        </Query>
    </xsl:template>
</xsl:stylesheet>