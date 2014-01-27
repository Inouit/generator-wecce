tt_content.<%= params.slugifiedContentName %> = COA
tt_content.<%= params.slugifiedContentName %> {
	1 = HEADERDATA
	1.value (
		<link rel="stylesheet" type="text/css" href="typo3conf/ext/skinFlex/<%= params.slugifiedContentName %>/assets/style.css" media="all">
	)

	5 = < lib.stdheader

	10 = COA
	10 {
		wrap = <!--TYPO3SEARCH_begin--><div class="<%= params.slugifiedContentName %>">|</div><!--TYPO3SEARCH_end-->

		10 = IMAGE
		10{
			file.import.data = t3datastructure : pi_flexform->file
			file.import.wrap = uploads/skinFlex/<%= params.slugifiedContentName %>/
		}

		20 = TEXT
		20{
			data = t3datastructure : pi_flexform->title
			wrap = <p>|</p>
		}
	}
}
