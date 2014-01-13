tt_content.<%= params.slugifiedContentName %> = COA
tt_content.<%= params.slugifiedContentName %> {
  1 = HEADERDATA
  1.value (
    <script type="text/javascript" src="typo3conf/ext/skinFlex/<%= params.slugifiedContentName %>/assets/<%= params.slugifiedContentName %>.js"></script>
    <link rel="stylesheet" type="text/css" href="typo3conf/ext/skinFlex/<%= params.slugifiedContentName %>/assets/style.css" media="all">
  ) 

  5 = < lib.stdheader

  10 = COA
  10 {
    wrap = <div class="<%= params.slugifiedContentName %>Bloc">|</div>

    ## // insert here
  }
}
