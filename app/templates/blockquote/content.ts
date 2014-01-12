tt_content.citation = COA
tt_content.citation {
	#1 = HEADERDATA
	#1.value (
		#<link rel="stylesheet" type="text/css" href="typo3conf/ext/skinFlex/citation/res/style.css" media="all">
	#)

	#5 = < lib.stdheader

	10 = COA
	10 {
		wrap = <div class="flexCitation">|</div>

		10 = < lib.stdheader

		20 = TEXT
		20{
			data = t3datastructure : pi_flexform->text
			wrap = |
			stdWrap.parseFunc < lib.parseFunc_RTE
		}
	}
}
